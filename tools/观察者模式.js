function Hunter(level,name){
    this.name = name;
    this.level = level;
    this.list = [];
}
Hunter.prototype.publish=function(money){
    console.log('%s猎人%s以%d的价格发布了一则任务',this.level,this.name,money)
    this.list.forEach(function(item){
        item(money)
    })
}
Hunter.prototype.subscribe=function(target,fn){
    console.log('%c%s猎人%s订阅了%s发布的任务','background-color:red;color:white',this.level,this.name,target.name)
    target.list.push(fn)
}

var Ming = new Hunter('青铜','小明')
var Hua = new Hunter('白银','小华')
var Hei = new Hunter('黄金','小黑')
var Bai = new Hunter('钻石','小白')

Hei.subscribe(Ming,function(money){
    if(money<200){
        console.warn('由于酬劳未达到期望，小黑拒绝接受%s的任务',Ming.name)
    }else{
        console.log('%c小黑接受了%s任务','background-color:green;color:white',Ming.name)
    }
})

Bai.subscribe(Ming,function(money){
    console.log('%c小白接受了%s任务','background-color:green;color:white',Ming.name)
})

Ming.publish(20)