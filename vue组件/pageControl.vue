<template>
    <div>
      <div class="page-control" v-if="pageNum>3">
        <div @click="selectPage(1)" class="first" v-text="'<<'"></div>
        <div @click="selectPage(prev)" :class="{'active':currentPage===prev}" class="prev">{{prev}}</div>
        <div  @click="selectPage(cur)" :class="{'active':currentPage===cur}" class="cur">{{cur}}</div>
        <div @click="selectPage(next)" :class="{'active':currentPage===next}" class="next">{{next}}</div>
        <div class="dot" v-show="currentPage<pageNum-2">......</div>
        <div @click="selectPage(pageNum)" :class="{'active':currentPage===pageNum}" class="num">{{pageNum}}</div>
        <div @click="selectPage(pageNum)" class="last" v-text="'>>'"></div>
      </div>
      <div class="page-control" v-else>
        <div @click="selectPage(i)" :class="{'active':currentPage===i}" v-for="i in pageNum" :key="i">{{i}}</div>
      </div>
    </div>
</template>

<script>
export default {
props:["currentPage","pageNum"],
computed:{
    prev() {
      return Math.min(
        this.currentPage > 1 ? this.currentPage - 1 : this.currentPage,
        this.pageNum - 3
      );
    },
    cur() {
      return Math.min(
        this.currentPage > 1 ? this.currentPage : this.currentPage + 1,
        this.pageNum - 2
      );
    },
    next() {
      return Math.min(
        this.currentPage > 1 ? this.currentPage + 1 : this.currentPage + 2,
        this.pageNum - 1
      );
    },
},
methods:{
    selectPage(n){
        this.$emit("selectPage",n)
    }
}
}
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.page-control {
  user-select: none;
  height: 50px;
  margin-top: 20px;
  width: 100%;
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 40px;
    height: 25px;
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 4px;
    margin-right: 15px;
    text-align: center;
    line-height: 25px;
    color: @color-text-dd;
  }
  & > div:last-child {
    margin: 0;
  }
  & > div:not(.dot):hover{
    cursor: pointer;
    color: #000;
  }
  .active {
    color: @color-theme;
    transition: .3s;
  }
  &>div.active:hover{
    color: @color-theme;
    text-shadow: 0 0 2px #ff0000;
  }
  .dot {
    border: none;
  }
}
</style>
