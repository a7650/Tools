var n = 0;
var hannuo1 = function () {
    var hannuo2 = function (num, src, dst, aux) {
        if (num > 0) {
            hannuo2(num - 1, src, aux, dst);
            document.write(num + " from " + src + " to " + dst + "<br>");
            hannuo2(num - 1, aux, dst, src);
            n = n + 1;
        }
    }
    return hannuo2;
}();
hannuo1(4, "src", "dst", "aux");
console.log(n);