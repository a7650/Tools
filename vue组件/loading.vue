<template>
  <div class="loading-container">
    <div class="loading">
      <img src="./loading.gif">
      <br>
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loadingText: {
      type: String,
      default: "正在加载"
    }
  }
};
</script>
<style lang="less" scoped>
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.loading {
  width: 100%;
  text-align: center;
  img {
    width: 30px;
    height: 30px;
  }
  p {
    color: rgb(123, 123, 123);
  }
}
</style>

<template>
</template>

<script>
</script>

<style>
</style>