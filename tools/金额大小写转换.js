
function formate(x) {
    var val = parseInt(x).toString();
    var a = val.split(""),
        len = val.length;
    var res = "";
    var all = Math.floor(len / 4),
        o = len % 4;
    var all_arr = [];
    for (var j = 0; j < all; j++) {
        all_arr.push(a.splice(a.length - 4, 4).join(""));
    }
    if (o) {
        all_arr.push(a);
    }
    var formateStr = function (val) {
        var str = "";
        var len = val.length;
        for (var i = 0; i < len; i++) {
            var allZero = true;
            for (var k = i; k < len; k++) {
                if (val[k] != "0") {
                    allZero = false;
                }
            }
            if (allZero) {
                return str;
            }
            if (val[i - 1] == "0" && val[i] == "0") {
                continue;
            }
            switch (val[i]) {
                case "0": str += "零"; break;
                case "1": str += "壹"; break;
                case "2": str += "贰"; break;
                case "3": str += "叁"; break;
                case "4": str += "肆"; break;
                case "5": str += "伍"; break;
                case "6": str += "陆"; break;
                case "7": str += "柒"; break;
                case "8": str += "捌"; break;
                case "9": str += "玖"; break;
            };
            if (val[i] !== "0") {
                switch (true) {
                    case (len - 1 - i === 1): str += "拾"; break;
                    case (len - 1 - i === 2): str += "佰"; break;
                    case (len - 1 - i === 3): str += "千"; break;
                }
            }
        }
        return str;
    }
    for (var i = 0; i < all_arr.length; i++) {
        if (parseInt(all_arr[i]) == 0) {
            continue;
        }
        switch (i) {
            case 1: res = "万" + res; break;
            case 2: res = "亿" + res; break;
        }
        res = formateStr(all_arr[i]) + res;
    }
    return res;
}
