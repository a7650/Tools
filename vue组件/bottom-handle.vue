<template>
    <div class="handles" ref="handles">
      <span
        v-if="othersHanders.length"
        v-for="(item,index) in othersHanders"
        :key="index"
        @click.stop="othersHandle(item.type)"
      >{{item.mes}}</span>
      
      <Float :float_message="float_message" v-if="float"></Float>
    </div>
</template>

<script>
import { setCreateAlbum, getCreateAlbum, createAlbum,getMyAlbum } from "common/js/cache";
import Float from "base/float/float";
import { float } from "common/js/mixin";
export default {
  mixins: [float],
  props: {
    currentSelect: {
      type: Object
    },
    Handers: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
  	
    };
  },
  computed: {

  },
  components: {
    ani,
    Float,
    scroll
  },
  methods: {
    othersHandle(type) {
      this.$emit("othersHandle", type);
    }
  },
  mounted() {

  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.handles {
  animation-duration: 0.2s;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 99;
  background: #fff;

  &>span {
    width: 100%;
    flex: 1;
    text-align: center;
    line-height: 50px;
    color: #000;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  .selectOther {
    position: fixed;
    top: 20%;
    bottom: 20%;
    left: 15%;
    right: 15%;
    background: #fff;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    .selectAlbum {
      header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        height: 40px;
        .title {
          float: right;
          width: 60%;
          text-align: center;
          line-height: 40px;
          color: #000;
        }
        .create {
          float: right;
          width: 20%;
          text-align: center;
          line-height: 40px;
          color: @color-text-d;
        }
      }
      .album-content{
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        padding: 0 20px;
        overflow: hidden;
        span {
          display: block;
          width: 100%;
          text-align: center;
          .no-wrap;
          height: 40px;
          line-height: 40px;
          color: #000;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      }
    }
    .createAlbum {
      position: fixed;
      top: 20%;
      bottom: 20%;
      left: 15%;
      right: 15%;
      background: #fff;
      border-radius: 5px;
      header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        height: 40px;
        color: #000;
        i {
          width: 10%;
          height: 40px;
          line-height: 40px;
          display: block;
          float: left;
          text-align: center;
          z-index: 99;
          position: relative;
        }
        .title {
          width: 80%;
          float: left;
          text-align: center;
          line-height: 40px;
        }
      }
      .detail {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        padding: 60px 20px 10px 20px;
        color: #000;
        display: flex;
        flex-direction: column;
        label:nth-child(1) {
          height: 80px;
        }
        label:nth-child(2) {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        input {
          margin: 10px 0 20px 0;
          width: 100%;
          height: 25px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          border-left: 1px solid #fff;
          border-right: 1px solid #fff;
        }
        textarea {
          width: 100%;
          resize: none;
          margin-top: 20px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          margin-left: -2px;
          flex: 1;
        }
        button {
          width: 70px;
          height: 35px;
          margin-top: 10px;
          background: black;
          border: none;
          color: #fff;
          align-self: center;
        }
      }
    }
  }
}
@keyframes bounce {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.bounce-enter-active {
  animation: bounce 0.5s;
}
.bounce-leave-active {
  transition: 0.3s;
}
.bounce-leave-to {
  opacity: 0;
}
</style>
