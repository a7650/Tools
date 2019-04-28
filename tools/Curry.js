function add() {
    var slice = Array.prototype.slice,
        argus = slice.apply(arguments);
    var doub = argus.map(function (a) {
        return a * 10;
    });
    return doub.reduce(function (a, b) {
        return a + b;
    });
}
Function.prototype.mcurry = function () {
    var argus = [].slice.call(arguments),
        self = this;
    return function () {
        return self.apply(null, argus.concat([].slice.call(arguments)))
    }
}

var add1 = add.mcurry(1, 2);
var a = add1.mcurry(1).mcurry(1)();
console.log(a);