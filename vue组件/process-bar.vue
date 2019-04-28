<template>
  <div class="time-control">
    <div class="process" ref="process">
      <div class="played" ref="played"></div>
      <div
        class="now"
        ref="now"
        @mousedown="processTouchStart"
        @mouseenter="processEnter"
        @mouseleave="processLeave"
      >
        <div class="tips" v-if="processing">{{this.processTime|formateTime}}</div>
      </div>
    </div>
    <div class="current-time">{{currentTime|formateTime}}</div>
    <div class="total-time">/{{duration|formateTime}}</div>
  </div>
</template>

<script>
import { formateTime } from "common/js/tools";
export default {
  data() {
    return {
      processTime: 0,
      processing: false
    };
  },
  props: {
    currentTime: {
      type: null,
      default: 0
    },
    duration: {
      type: null,
      default: 0
    }
  },
  filters: {
    formateTime
  },
  methods: {
    processEnter(e) {
      e.currentTarget.classList.add("an-enter");
    },
    processLeave(e) {
      if (!this.touch.init) {
        e.currentTarget.classList.remove("an-enter");
      }
    },
    processTouchStart(e) {
      this.$refs.now.classList.add("an-enter");
      this.touch.init = true;
      this.touch.startX = e.pageX;
      this.touch.playedX = this.$refs.played.clientWidth;
      this.touch.processWidth = this.$refs.process.clientWidth;
    },
    processTouchMove(e) {
      if (!this.touch.init) {
        return;
      }
      let d_x = e.pageX - this.touch.startX;
      this.touch.playedX2 = Math.max(
        Math.min(d_x + this.touch.playedX, this.touch.processWidth),
        0
      );
      this.processTime = Math.floor(
        (this.duration * this.touch.playedX2) / this.touch.processWidth
      );
      this.set_pos(this.touch.playedX2, "px");
      this.processing = true;
    },
    processTouchEnd() {
      if (!this.touch.init) {
        return;
      }
      this.$refs.now.classList.remove("an-enter");
      this.touch.init = false;
      this.processing = false;
      this.$emit("turnProcess", this.processTime);
    },
    set_pos(x, unit) {
      this.$refs.played.style.width = `${x}${unit}`;
      this.$refs.now.style.left = `${x}${unit}`;
    }
  },
  computed: {
    process() {
      return Math.floor((100 * this.currentTime) / this.duration);
    }
  },
  watch: {
    process(n, o) {
      if (!this.touch.init) {
        this.set_pos(n, "%");
      }
    }
  },
  created() {
    this.touch = {};
  },
  mounted() {
    window.addEventListener("mouseup", this.processTouchEnd);
    window.addEventListener("mousemove", this.processTouchMove);
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.time-control {
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  .current-time,
  .total-time {
    // flex-basis: 50px;
    // line-height: 30px;
    font-size: @font-size-medium;
  }
  .current-time {
    text-align: right;
  }
  .total-time {
    text-align: left;
    color: @color-text-dd;
  }
  .process {
    flex: 1;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    position: relative;
    margin: 0 10px;
    border-radius: 5px;
    .played {
      width: 0;
      height: 100%;
      background: @color-theme;
      border-radius: 5px;
    }
    .now {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #fff;
      position: absolute;
      top: -10px;
      margin-left: -5px;
      position: relative;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
      // transition: 0.2s;
      transform-origin: center;
      .tips {
        width: 40px;
        border-radius: 5px;
        background: #fff;
        color: #000;
        padding: 4px;
        position: absolute;
        left: -19px;
        top: -25px;
        transform-origin: bottom;
        transform: scale(0.7);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
    }
    .an-enter {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
      animation: enter 0.3s;
      animation-fill-mode: forwards;
    }
    .now:hover {
      cursor: pointer;
      // background-color: #2298f0;
      // transform: scale(1.3);
      // box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}
@keyframes enter {
  30% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1.4);
  }
}
</style>
