<template>
    <div class="time-control">
        <div class="now-time">{{timeFormate(nowTime)}}</div>
            <div class="process" ref="process">
                <div class="played" ref="played"></div>
                <div class="now" ref="now"
                    @touchstart.prevent="processTouchStart"
                    @touchmove.prevent="processTouchMove"
                    @touchend="processTouchEnd"
                >
                    <div class="tips" v-if="processing">{{timeFormate(processTime)}}</div>
                </div>
            </div>
        <div class="total-time">{{timeFormate(totalTime)}}</div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            processTime:0,
            processing:false
        }
    },
    props:["nowTime","totalTime"],
    methods:{
        processTouchStart(e){
            this.touch.init = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.playedX = this.$refs.played.clientWidth;  
            this.touch.processWidth = this.$refs.process.clientWidth;
        },
        processTouchMove(e){
            if(!this.touch.init){
                return
            }
            let d_x = e.touches[0].pageX - this.touch.startX;
            this.touch.playedX2 =Math.max(Math.min(d_x+this.touch.playedX,this.touch.processWidth),0);
            this.processTime = Math.floor(this.totalTime*this.touch.playedX2/this.touch.processWidth);
            this.set_pos(this.touch.playedX2,"px");
            this.processing = true;
        },
        processTouchEnd(){
            this.touch.init = false;
            this.processing = false;
            this.$emit("turnProcess",this.processTime);
        },
        set_pos(x,unit){
            this.$refs.played.style.width = `${x}${unit}`;
            this.$refs.now.style.left = `${x}${unit}`;
        },
        r(x){
            if(x<10){
                return "0"+x;
            }
            return x
        },
        timeFormate(total_s){
            let m = Math.floor(total_s/60);
            let s = Math.floor(total_s % 60);
            return `${this.r(m)}:${this.r(s)}`
        }
    },
    computed:{
        process(){
            return Math.floor(100*this.nowTime/this.totalTime);
        }
    },
    watch:{
        process(n,o){
            if(!this.touch.init){
            this.set_pos(n,"%");
            }
        }
    },
    created(){
        this.touch = {}
    }

    
}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";

.time-control{
            height: 30px;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            align-items: center;
            .now-time,.total-time{
                flex-basis: 50px;
                line-height: 30px;
                text-align: center;
            }
            .process{
                flex: 1;
                height: 2px;
                background: rgba(225, 225, 225, .3);
                position: relative;
                margin: 0 10px;
                .played{
                    height: 100%;
                    background:#fff;
                }
                .now{
                    width: 14px;
                    height: 14px;
                    border-radius: 6px;
                    background: #fff;
                    position: absolute;
                    top:-7px;
                    margin-left: -7px;
                    position:relative;
                    .tips{
                        width: 40px;
                        border-radius: 5px;
                        background: #fff;
                        color: #000;
                        padding: 4px;
                        position: absolute;
                        left: -13px;
                        top: -30px;
                    }
                }
            }
        }
</style>
