<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>


<script>
import BScroll from 'better-scroll'
export default {
    props:{
        probeType:{
            type:Number,
            default:1
        },
        click:{
            type:Boolean,
            default:true
        },
        stopPropagation:{
            type:Boolean,
            default:false
        },
        data:{
            type:Array,
            default:null
        },
        startY:{
            type:Number,
            default:0
        },
        zoom:{
            type:Object,
            default:null
        },
         listenScroll: {
            type: Boolean,
            default: false
      },
      pullUp:{
          type:Boolean,
          default:false
      }

    },
    methods:{
        _initScroll(){
            if(!this.$refs.wrapper){
                return;
            }
            this.scroll=new BScroll(this.$refs.wrapper,{
                probeType : this.probeType,
                click : this.click,
                stopPropagation:this.stopPropagation
            });
            if (this.listenScroll) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos)
                })
            }
            if(this.pullUp){
                this.scroll.on("scrollEnd",()=>{
                    if(this.scroll.y<=this.scroll.maxScrollY+50){
                        this.$emit("scrollToEnd")
                    }
                })
            }
        },
        enable(){
            this.scroll && this.scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable();
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    mounted(){
        setTimeout(() => {
            this._initScroll();
        }, 20);
    },
    watch:{
        data(){
            this.refresh();
        }
    }
}
</script>
