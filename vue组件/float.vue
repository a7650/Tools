<template>
<!-- 注册全局组件
注册全局混入（在mounted里面添加: if (this.$refs.float)this.float = this.$refs.float.float}）
使用的时候直接在html里面写这个标签（加ref="float）
this.float("mes") -->
  <div>
    <transition name="float">
      <div class="float" v-if="floatShow">
        <div class="mes" v-html="float_message"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    float_time: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      floatShow: false,
      float_message: ""
    };
  },
  methods: {
    float(message) {
      if (this.floatShow) {
        this.floatShow = false;
        clearTimeout(this.float_timer);
      }
      this.float_message = message;
      this.floatShow = true;
      this.float_timer = setTimeout(() => {
        this.floatShow = false;
        this.float_message = "";
      }, this.float_time);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.float {
  position: fixed;
  width: 220px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 5px;
  padding: 10px;
  z-index: 999;
  top: 50%;
  left: 50%;
  margin-left: -110px;
  margin-top: -60px;
  transition: 0.2s;
  .mes {
    width: 100%;
    text-align: center;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 20px;
    line-height: 25px;
  }
}

.float-enter-active {
  animation: float 0.4s;
}

.float-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

@keyframes float {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
