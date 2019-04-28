var momoizer = function (memo, func, n) {
    var res = function (n) {
        result = memo[n];
        if (typeof memo[n] !== "number") {
            result = func(n, res);
            memo[n] = result;
        }
        return result;
    }
    return res(n);
};
var x = momoizer([0, 1], function (n, res) {
    return res(n - 1) + res(n - 2);
}, 10);
console.log(x);