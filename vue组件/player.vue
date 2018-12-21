<template>
  <div class="player" v-show="playList.length>0">
    <player-animation>
      <!-- main-player -->
      <div class="main-player" v-show="fullScreen">
        <div class="bg" :style="bgStyle"></div>
        <div class="bg2"></div>
        <!-- header -->
        <header>
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <div class="more">
            <i class="icon-more"></i>
          </div>
          <div class="song-name" v-html="currentSong.name"></div>
          <div class="singer-name">
            <span class="line left-line"></span>
            <span class="name" v-html="currentSong.singer"></span>
            <span class="line right-line"></span>
          </div>
        </header>
        <!-- main -->
        <div
          class="main"
          :class="{blur:listShow}"
          @touchstart="mainTouchStart"
          @touchmove="mainTouchMove"
          @touchend="mainTouchEnd"
        >
          <div class="left" ref="mainLeft">
            <div class="fg" :class="cdRotate" :style="bgStyle"></div>
            <div class="lyric" v-if="currentLyric">
              <span v-if="noLyric">暂无歌词</span>
              <span v-if="!noLyric">{{currentLyric.lines[lyricLine].txt}}</span>
            </div>
          </div>
          <div class="dots">
            <span class="dot" :class="{active:activePage === 0}"></span>
            <span class="dot" :class="{active:activePage === 1}"></span>
          </div>
          <div class="right" ref="mainRight">
            <div class="no-lyric" v-if="noLyric">暂无歌词</div>
            <scroll class="lyric-content" ref="lyricLists" :data="currentLyric&&currentLyric.lines">
              <div>
                <ul class="lyric" v-if="currentLyric">
                  <li
                    class="line"
                    ref="lyricList"
                    :class="{'active':lyricLine === index}"
                    v-for="(line,index) in currentLyric.lines"
                    :key="index"
                  >{{line.txt}}</li>
                </ul>
              </div>
            </scroll>
          </div>
          <div class="favorite" @click="setFavorite">
            <i :class="favoriteIcon"></i>
          </div>
        </div>
        <!-- footer -->
        <div class="footer" :class="{blur:listShow}">
          <process-bar
            :nowTime="nowTime"
            :totalTime="currentSong.duration"
            @turnProcess="turnProcess"
          ></process-bar>
          <div class="operators">
            <div class="icon mode" @click="toggleMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon prev" @click="prevSong">
              <i class="icon-prev" :class="{unReady:!(readyPlay&&ready)}"></i>
            </div>
            <div class="icon center" @click="togglePlaying">
              <i :class="playingIcon"></i>
            </div>
            <div class="icon next" @click="nextSong">
              <i class="icon-next" :class="{unReady:!(readyPlay&&ready)}"></i>
            </div>
            <div class="icon list" @click="listShow=!listShow">
              <i class="icon icon-list"></i>
            </div>
          </div>
        </div>
      </div>
    </player-animation>

    <!-- mini-player -->
    <div class="mini-player" v-show="!fullScreen" @click="showMainPlayer">
      <div class="mini-img">
        <div>
          <div class="mini-bg" :class="cdRotate" :style="bgStyle"></div>
        </div>
      </div>
      <div class="song-desc">
        <span class="name" v-html="currentSong.name"></span>
        <span class="singer" v-html="currentSong.singer"></span>
      </div>
      <div class="icon">
        <i :class="miniPlayingIcon" @click.stop="togglePlaying"></i>
        <i class="icon-list" @click.stop="listShow=!listShow"></i>
      </div>
    </div>

    <!-- mini-list -->
    <div class="list-bg" v-show="listShow" @click="listShow=false"></div>
    <mini-list-animation>
      <div class="mini-list" v-if="listShow">
        <header>
          <div class="icon" @click="toggleMode">
            <i :class="modeIcon"></i>
          </div>
          <div class="title">播放列表({{playList.length}})</div>
          <div></div>
        </header>
        <scroll class="list-content">
          <mini-list @selectSong="selectSong" @deleteSong="_deleteSong"></mini-list>
        </scroll>
        <div class="close" @click="listShow=!listShow">关闭</div>
      </div>
    </mini-list-animation>

    <audio
      id="audio"
      ref="audio"
      @ended="toggleSong"
      @timeupdate="timeupdate"
      @play="audioReadyPlay"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import playerAnimation from "base/animation/player-animation";
import miniListAnimation from "base/animation/mini-list-animation";
import miniList from "base/mini-list/mini-list";
import scroll from "base/scroll/scroll";
import { playMode } from "common/config";
import { shuffle } from "common/js/tools";
import processBar from "base/process-bar/process-bar";
import Lyric from "lyric-parser";
import {isFavorite} from 'common/js/favorite'
import { setPlayHistory } from "common/js/cache";
const MIN_DISTANCE = 0.2;

export default {
  data() {
    return {
      nowTime: 0,
      listShow: false,
      lyricLine: 0,
      currentLyric: null,
      noLyric: false,
      activePage: 0,
      readyPlay: false,
      ready: false
    };
  },
  computed: {
    favoriteIcon(){
      let mid = this.favoriteMid;
      let m = isFavorite(this.currentSong.mid);
      return {
        "icon-favorite":m,
        "icon-unfavorite":!m
      }
    },
    bgStyle() {
      return { "background-image": `url(${this.currentSong.image})` };
    },
    playingIcon() {
      return {
        "icon-pause2": this.playing,
        "icon-play2": !this.playing,
        unReady: !(this.readyPlay && this.ready)
      };
    },
    miniPlayingIcon() {
      return {
        "icon-pause": this.playing,
        "icon-play": !this.playing
      };
    },
    cdRotate() {
      return this.playing ? "playing" : "playing pause";
    },
    modeIcon() {
      return this.playMode === playMode.sequence
        ? "icon-list-loop"
        : this.playMode === playMode.loop
        ? "icon-song-loop"
        : "icon-list-random";
    },

    ...mapGetters([
      "playing",
      "fullScreen",
      "currentSong",
      "playList",
      "sequenceList",
      "currentIndex",
      "playMode",
      "favoriteMid"
    ])
  },
  components: {
    playerAnimation,
    miniList,
    scroll,
    miniListAnimation,
    processBar,
    scroll
  },
  methods: {
    setFavorite(){
      let m = isFavorite(this.currentSong.mid);
      if(m){
        this.DELETE_FAVORITE(this.currentSong);
      }else{
        this.ADD_FAVORITE(this.currentSong);
      }
      this.REFRESH_MYALBUM();
    },
    audioReadyPlay() {
      this.readyPlay = true;
      if (this.currentLyric) {
        this.currentLyric.seek(this.nowTime * 1000);
      }
    },
    timeupdate() {
      this.nowTime = this.$refs.audio.currentTime;
    },
    back() {
      this.SET_FULLSCREEN(false);
      this.listShow = false;
    },
    showMainPlayer() {
      this.SET_FULLSCREEN(true);
    },
    toggleMode() {
      let m = (this.playMode + 1) % 3;
      let newList = null;
      if (m == playMode.random) {
        newList = shuffle(this.sequenceList);
      } else {
        newList = this.sequenceList;
      }
      this.resetIndex(newList);
      this.SET_PLAYMODE(m);
      this.SET_PLAYLIST(newList);
    },
    resetIndex(list) {
      let i = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.SET_CURRENTINDEX(i);
    },
    togglePlaying(e) {
      if (!(this.readyPlay && this.ready)) {
        return;
      }
      this.SET_PLAYING(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    nextSong() {
      if (!(this.readyPlay && this.ready)) {
        return;
      }
      if (this.playList.length === 1) {
        this.loopSong();
      } else if (this.currentIndex < this.playList.length - 1) {
        this.SET_CURRENTINDEX(this.currentIndex + 1);
      } else if (this.currentIndex === this.playList.length - 1) {
        this.SET_CURRENTINDEX(0);
      }
    },
    prevSong() {
      if (!(this.readyPlay && this.ready)) {
        return;
      }
      if (this.currentIndex > 0) {
        this.SET_CURRENTINDEX(this.currentIndex - 1);
      }
      if (this.playList.length === 1) {
        this.loopSong();
      }
    },
    loopSong() {
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
      this.nowTime = this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    toggleSong() {
      if (this.playMode === playMode.loop) {
        this.loopSong();
      } else {
        this.nextSong();
      }
    },
    selectSong(song, index) {
      this.SET_CURRENTINDEX(index);
    },
    turnProcess(nowTime) {
      this.nowTime = this.$refs.audio.currentTime = nowTime;
      if (this.currentLyric) {
        this.currentLyric.seek(nowTime * 1000);
      }
      if (!this.playing) {
        this.SET_PLAYING(true); //seek后Lyric会自动变为播放模式，这里不能用toggle  否则会toggle两次
      }
    },
    _deleteSong(index) {
      this.deleteSong(index);
    },
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if(!this.currentLyric.lines.length){
            this.currentLyric.stop();
            this.currentLyric = null;
            this.noLyric = true;
            return;
          }
          if (this.readyPlay) {
            this.currentLyric.play();
            this.currentLyric.seek(this.nowTime * 1000);
          }
          // console.log(this.currentLyric);
        })
        .catch(() => {
          this.noLyric = true;
          if (this.currentLyric) {
            this.currentLyric.stop();
          }
          this.currentLyric = null;
          this.lyricLine = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.lyricLine = lineNum || 0;
      let n = this.lyricLine > 4 ? this.lyricLine - 4 : 0;
      let el = this.$refs.lyricList[n];
      this.$refs.lyricLists.scrollToElement(el, 1000);
    },
    mainTouchStart(e) {
      this.touch.init = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    mainTouchMove(e) {
      if (!this.touch.init) {
        return;
      }
      const touch = e.touches[0];
      const d_x = touch.pageX - this.touch.startX;
      const d_y = touch.pageY - this.touch.startY;
      if (Math.abs(d_y) > Math.abs(d_x)) {
        return;
      }
      let end_x = this.activePage === 0 ? window.innerWidth : 0;
      let now_x = Math.min(Math.max(0, d_x + end_x), window.innerWidth);
      this.touch.precent = Math.abs(now_x / window.innerWidth);

      this.$refs.mainRight.style.transition = "0s";
      this.$refs.mainLeft.style.transition = "0s";
      this.$refs.mainRight.style.marginLeft = `${-(
        window.innerWidth - now_x
      )}px`;
      this.$refs.mainLeft.style.opacity = this.touch.precent;
    },
    mainTouchEnd(e) {
      let end_x = 0;
      let end_opacity = 0;
      if (this.activePage === 0) {
        if (this.touch.precent > 1 - MIN_DISTANCE) {
          end_x = 0;
          end_opacity = 1;
        } else {
          end_x = -window.innerWidth;
          end_opacity = 0;
          this.activePage = 1;
          this.touch.precent = 0;
        }
      } else {
        if (this.touch.precent < MIN_DISTANCE) {
          end_x = -window.innerWidth;
          end_opacity = 0;
        } else {
          end_x = 0;
          end_opacity = 1;
          this.activePage = 0;
          this.touch.precent = 1;
        }
      }
      this.$refs.mainRight.style.transition = "0.5s";
      this.$refs.mainLeft.style.transition = "0.5s";
      this.$refs.mainRight.style.marginLeft = `${end_x}px`;
      this.$refs.mainLeft.style.opacity = end_opacity;
      this.touch.init = false;
    },
    ...mapMutations([
      "SET_FULLSCREEN",
      "SET_PLAYING",
      "SET_CURRENTINDEX",
      "SET_PLAYMODE",
      "SET_PLAYLIST",
      "SET_PLAYER",
      "ADD_FAVORITE",
      "DELETE_FAVORITE",
      "REFRESH_MYALBUM"
    ]),
    ...mapActions(["deleteSong"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      this.readyPlay = false;
      this.ready = false;
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLyric = null;
        this.lyricLine = 0;
      }
      this.noLyric = false;
      this.nowTime = 0;
      this.getLyric();
      this.$refs.audio.src = newSong.url;
      this.$refs.audio.play();
      this.SET_PLAYING(true);
      setPlayHistory(this.currentSong)
      // if(this.timer){clearTimeout(this.timer)}
      // this.timer = setTimeout(() => {
      //     if(this.currentLyric){
      //         this.currentLyric.seek(this.nowTime*1000)
      //         if(!this.playing){
      //             this.currentLyric.toggle();
      //         }
      //         this.timer = null;
      //     }
      // }, 5000);
      if (this.timer2) {
        clearTimeout(this.timer2);
      }
      this.timer2 = setTimeout(() => {
        this.ready = true;
        this.timer2 = null;
      }, 1000);

      // clearTimeout(this.timer);
      // this.comNowTime();
    },
    playing() {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        if (this.playing) {
          audio.play();
        } else {
          audio.pause();
        }
      });
    },
    fullScreen() {
      if (this.playing && this.fullScreen && this.currentLyric) {
        this.currentLyric.seek(this.nowTime * 1000);
      }
    }
  },
  created() {
    this.touch = {};
  },
  mounted() {
    this.SET_PLAYER(this.$refs.audio);
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";

.player {
  min-width: 200px;
}
.blur {
  filter: blur(10px);
}
.main-player {
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: rgb(109, 109, 109);
  animation-duration: 0.3s;
  .bg {
    position: fixed;
    width: 100%;
    height: 100%;
    // top: -15%;
    // left: -15%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    z-index: -99;
  }
  .bg2 {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -98;
    background: rgba(0, 0, 0, 0.3);
  }
  header {
    width: 100%;
    height: 40px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      i {
        padding: 9px;
        display: block;
        transform: rotateZ(-90deg);
        font-size: @font-size-large-x;
      }
    }
    .more {
      position: absolute;
      top: 0;
      right: 6px;
      i {
        font-size: 36px;
      }
    }
    .song-name {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 50px;
      line-height: 40px;
      text-align: center;
      font-size: @font-size-large;
      .no-wrap;
    }
    .singer-name {
      width: 100%;
      text-align: center;
      font-size: @font-size-small;
      box-sizing: border-box;
      padding: 0 10%;
      display: block;
      white-space: nowrap;
      .name {
        display: inline-block;
        max-width: 50%;
        .no-wrap;
        padding: 0 5px;
      }
      .line {
        display: inline-block;
        border-top: 1px solid #fff;
        width: 20px;
        position: relative;
        bottom: 6px;
      }
    }
  }
  .main {
    flex: 1;
    position: relative;
    height: 1px;
    overflow: hidden;
    float: left;
    .left,
    .right {
      width: 100%;
      height: 100%;
    }
    .left {
      // display: none;
      transform-origin: center;
      .fg {
        width: 250px;
        height: 250px;
        background-size: cover;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -130px 0 0 -130px;
        border-radius: 130px;
        border: 10px solid rgba(0, 0, 0, 0.7);
      }
      .playing {
        animation: rotate 20s linear infinite;
      }
      .pause {
        animation-play-state: paused;
      }
      .lyric {
        span {
          width: 100%;
          box-sizing: border-box;
          padding: 20px;
          text-align: center;
          color: #fff;
          position: absolute;
          bottom: 0;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 5px;
      transform: translateZ(1px);
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(225, 225, 225, 0.2);
        &.active {
          background: #fff;
        }
      }
    }
    .favorite {
      width: 20px;
      height: 20px;
      position: absolute;
      bottom: 0;
      right: 4%;
      i {
        font-size: 20px;
        &.icon-favorite {
          color: red;
        }
        &.icon-unfavorite {
          color: #fff;
        }
      }
    }
    .right {
      // display: none;
      position: absolute;
      left: 100%;
      right: 200%;
      top: 0;
      bottom: 0;
      .no-lyric {
        width: 100%;
        text-align: center;
        margin-top: 200px;
      }
      .lyric-content {
        position: absolute;
        top: 15%;
        bottom: 15%;
        left: 0;
        right: 0;
        overflow: hidden;
      }
      .lyric {
        .line {
          text-align: center;
          box-sizing: border-box;
          padding: 10px 20px;
          width: 100%;
          color: rgba(255, 255, 255, 0.4);
        }
        .active {
          color: #fff;
        }
      }
    }
  }
  .footer {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 3%;
    margin-bottom: 10px;
    .operators {
      flex: 1;
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        justify-content: space-between;
        text-align: center;
        i {
          font-size: 30px;
          color: #fff;
          &.unReady {
            color: rgba(225, 225, 225, 0.5);
          }
        }
      }
      .mode {
        i {
          font-size: @font-size-large-x;
          font-weight: bold;
        }
      }
      .prev,
      .next {
        i {
          font-size: @font-size-large-x;
        }
      }
      .center {
        i {
          display: inline-block;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
  }
}

.mini-player {
  position: fixed;
  top: 92%;
  bottom: 0;
  left: 0;
  right: 0;
  background: @color-background;
  z-index: 100;
  padding: 5px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  .mini-img {
    width: 10%;
    height: 0;
    padding-top: 10%;
    position: relative;
    margin-left: 10px;
    & > div {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      .mini-bg {
        width: 100%;
        height: 100%;
        background-size: cover;
        border-radius: 50%;
      }
      .playing {
        animation: rotate 20s linear infinite;
      }
      .pause {
        animation-play-state: paused;
      }
    }
  }
  .song-desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 65%;
    box-sizing: border-box;
    padding: 0 30% 0 10px;
    .name {
      color: @color-theme;
      .no-wrap;
      font-size: @font-size-medium-x;
    }
    .singer {
      .no-wrap;
      color: @color-text-d;
      font-size: @font-size-medium;
      margin-top: 5px;
    }
  }
  .icon {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    i {
      font-size: 30px;
      color: @color-theme;
      &.icon-play {
        font-size: 27px;
      }
    }
  }
}
.list-bg {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
}

.mini-list {
  z-index: 101;
  position: fixed;
  top: 30%;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  animation-duration: 0.3s;
 
  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 93%;
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000;
     border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    div {
      flex: 1;
    }
    .icon {
      i {
        font-size: @font-size-large-x;
      }
    }
    .title {
      text-align: center;
      min-width: 100px;
    }
  }
  .list-content {
    position: absolute;
    top: 7%;
    left: 0;
    right: 0;
    bottom: 10%;
    overflow: hidden;
  }
  .close {
    padding: 10px 5% 0 5%;
    position: absolute;
    top: 90%;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.95);
    color: #000;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
