<template>
  <div class="m-header">
    <!-- <div class="icon"></div> -->
    <h1 class="text">My Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-main"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="less">
  @import "~common/stylus/variable.less";
  @import "~common/stylus/mixin.less";

  .m-header{
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-text;
    font-size: 0;
    .text{
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: @font-size-large;
    }
    .mine{
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine{
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
    }
  }
</style>