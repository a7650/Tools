<template>
  <div class="disc-detail">
    <div class="bg" ref="bg" :style="bgStyle"></div>
    <div class="filter"></div>
    <div class="scroll-area">
      <div class="text">
        <div class="logo">
          <img :src="imgUrl" alt>
        </div>
        <div class="other">
          <div class="title">{{name}}</div>
          <div class="desc">{{desc}}</div>
          <div class="play">
            <i class="icon-play" @click="randomPlay"></i>
          </div>
        </div>
      </div>
      <scroll class="song-content" ref="songContent" :data="songList">
        <discSonglist
          v-if="songList.length"
          :songList="songList"
          @selectMore="_selectMore"
          @selectSong="_selectSong"
          ref="disSonglist"
        ></discSonglist>
        <div class="tip" v-if="!songList.length">这个歌单什么也没有</div>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import discSonglist from "base/disc-songlist/disc-songlist";
import { adaptMiniPlay } from "common/js/mixin";
import { shuffle } from "common/js/tools";
import { mapActions } from "vuex";

export default {
  mixins: [adaptMiniPlay],
  props: ["songList", "bgUrl", "name", "desc"],

  components: {
    scroll,
    discSonglist
  },
  computed: {
    bgStyle() {
      let url = this.bgUrl ? this.bgUrl : require("./default.png");
      return {
        "background-image": `url(${url})`
      };
    },
    imgUrl() {
      return this.bgUrl ? this.bgUrl : require("./default.png");
    }
  },
  methods: {
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "15%" : 0;
      this.$refs.songContent.$el.style.bottom = bottom;
      this.$refs.songContent.refresh();
    },
    _selectMore(song,index) {
        this.$emit("_selectMore",song,index);
    },
    randomPlay() {
      let randomList = shuffle(this.songList);
      this.selectSong({
        list: randomList,
        index: 0
      });
    },
    _selectSong(song, index, filterList) {
      this.selectSong({
        list: [...filterList],
        index
      });
    },
    randomPlay() {
      let randomList = shuffle(this.songList);
      this.selectSong({
        list: randomList,
        index: 0
      });
    },
    ...mapActions(["selectSong"])
  },
  mounted() {
    this.bgHeight = this.$refs.bg.clientHeight;
    this.$refs.songContent.$el.style.top = `${this.bgHeight - 40}px`;
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";

.disc-detail {
  animation-duration: 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: @color-background;
  .bg {
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: 110%;
    position: fixed;
    top: 0;
    left: 0;
    filter: blur(20px);
  }
  .filter {
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: 110%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .scroll-area {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    padding: 0 20px;
    .text {
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      .logo {
        width: 150px;
        height: 150px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .other {
        max-height: 150px;
        box-sizing: border-box;
        overflow: hidden;
        flex: 1;
        padding: 10px 10px 0 10px;
        display: flex;
        flex-direction: column;
        color: #fff;
        .title {
          font-size: @font-size-large;
          font-weight: 600;
          height: 20px;
          .no-wrap();
        }
        .desc {
          margin-top: 15px;
          flex: 1;
        }
        .play {
          height: 30px;
          i {
            font-size: 25px;
          }
        }
      }
    }
    .song-content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .tip {
        position: absolute;
        height: 20px;
        color: @color-text-d;
        width: 100%;
        text-align: center;
        line-height: 20px;
        top: 50%;
      }
    }
  }
}
</style>
