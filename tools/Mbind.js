Function.prototype.mcall=function(){
    let context = arguments[0] || window
    let args = []
    for(let i=1;i<arguments.length;i++){
        args.push(arguments[i])
    }
    context._fn_ = this
    let result = context._fn_(...args)
    delete context._fn_
    return result
}

Function.prototype.mapply=function(){
    if(arguments.length===2&&arguments[1] instanceof Array){
        this.mcall(arguments[0],...arguments[1])
    }else{
        this.mcall(...Array.from(arguments))
}
}

Function.prototype.mbind=function(){
    let self = this
    let context = [].shift.call(arguments)
    let args = Array.from(arguments)
    return function(){
        self.apply(context,[].concat.call(args,Array.from(arguments)))
    }
}