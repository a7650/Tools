<template>
  <transition name="float">
    <div class="float">
      <span v-html="float_message"></span>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["float_message"]
};
</script>

<style lang="less" scoped>
.float {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -60px;
  margin-left: -120px;
  width: 240px;
  height: 120px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 15px;
  border-radius: 5px;
  span {
    width: 100%;
    text-align: center;
    color: #fff;
  }
}
.float-enter-active{
    animation: bounce .5s;
}
.float-leave-active{
    transition: .3s;
}
.float-leave-to{
    opacity: 0;
}
@keyframes bounce{
    0%{
        opacity: 0;
        transform: scale(0)
    }
    50%{
        transform: scale(1.1)
    }
    100%{
        transform: scale(1)
    }
}
</style>
