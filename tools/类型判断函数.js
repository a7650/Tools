function type(target) {
                var ret = typeof(target);
                var template = {
                    "[object Array]": "array",
                    "[object Object]":"object",
                    "[object Number]":"number - object",
                    "[object Boolean]":"boolean - object",
                    "[object String]":'string-object'
                }

                if(target === null) {
                    return 'null';
                }else if(ret == "object"){
                    var str = Object.prototype.toString.call(target);
                    return template[str];
                }else{
                    return ret;
                }
        }
