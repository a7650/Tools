function observe(data) {
    if (!data || typeof data != 'object') {
        return
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}
function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val);
    //给每一个属性定义setter和getter
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            Dep.target && dep.addSub(Dep.target);//添加watcher
            return val
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
            dep.notify()//通知watcher
        }
    })
}
function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update()
        })
    }
}
Dep.target = null;
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();
}
Watcher.prototype = {
    update: function () {
        this.run();    // 属性值变化收到通知
    },
    run: function () {
        var value = this.getVmVal(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    },
    get: function () {
        Dep.target = this;  // 将当前订阅者指向自己
        var value = this.getVmVal();    // 触发getter，添加自己到属性订阅器中
        Dep.target = null;    // 重置
        return value;
    },
    getVmVal: function () {
        var curval = this.vm._data,
            keys = this.exp.split('.');
        keys.forEach(function (key) {
            curval = curval[key]
        })
        return curval
    }
};

function Compile(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }
}
Compile.prototype = {
    init: function () {
        this.compileElement(this.$fragment)
    },
    compileElement: function (fragment) {
        var childNodes = fragment.childNodes,
            self = this;
        [].slice.call(childNodes).forEach(function (node, index) {
            var text = node.textContent,
                reg = /\{\{(.*)\}\}/;
            if (self.isElementNode(node)) {
                self.compileElementNode(node, index)
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileTextNode(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }

        })
    },
    compileElementNode(node, index) {
        var attrs = node.attributes,
            self = this;
        if (!attrs.length) { return }
        [].slice.call(attrs).forEach(function (attr) {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value,
                    dir = attr.name.substring(2);
                if (self.isEventDirective(attrName)) {
                    self.eventHandle(node, self.$vm, dir, exp)
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp, index)
                }
                node.removeAttribute(attrName)
            }
        })
    },
    isDirective(attr) {
        var n = attr.indexOf('v-')
        return n === 0
        // return attr.indexOf('v-') === 0
    },
    isEventDirective(attr) {
        var n = attr.indexOf('on')
        return n === 0
    },
    eventHandle(node, vm, dir, exp) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm))
        }
    },
    compileTextNode(node, exp) {
        compileUtil.text(node, this.$vm, exp)
    },
    isElementNode(el) {
        return el.nodeType === 1
    },
    isTextNode: function (el) {
        return el.nodeType === 3
    },
    node2Fragment: function (el) {
        var fragment = document.createDocumentFragment(),
            child = el.firstElementChild;
        fragment.appendChild(child)
        return fragment
    }
}

var compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    if: function (node, vm, exp, index) {
        var fn = updater.if,
            val = this.getVmVal(vm, exp),
            parentNode = node.parentNode;
        if (!val) {
            parentNode.removeChild(node)
        }
        new Watcher(vm, exp, function (newVal, oldVal) {
            fn && fn(node, parentNode, index, newVal, oldVal)
        })
    },
    show: function (node, vm, exp) {
        this.bind(node, vm, exp, 'show')
    },
    bind(node, vm, exp, dir) {
        var fn = updater[dir]
        fn && fn(node, this.getVmVal(vm, exp))
        new Watcher(vm, exp, function (newVal, oldVal) {
            fn && fn(node, newVal, oldVal)
        })
    },
    getVmVal(vm, exp) {
        var keys = exp.split('.'),
            curVal = vm._data;
        keys.forEach(function (key) {
            curVal = curVal[key]
        })
        if (curVal == 'undefined') {
            throw new Error("data." + exp + " is undefined")
        }
        return curVal
    }
}

var updater = {
    text: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    html: function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value
    },
    if: function (node, parentNode, index, value) {
        var nodes = parentNode.childNodes;
        if (value) {
            if (index === nodes.length - 1) {
                parentNode.appendChild(node)
            } else {
                parentNode.insertBefore(node, nodes[index + 1])
            }
        } else {
            parentNode.removeChild(node)
        }
    },
    show: function (node, value) {
        var display = value ? '' : 'none';
        node.style.display = display
    }
}




function Mvue(options) {
    this.$options = options;
    var self = this,
        data = this._data = this.$options.data;
    Object.keys(data).forEach(function (key) {
        self._proxy(key)
    })
    observe(data, this);
    this.$compile = new Compile(options.el || document.body, this)
}
Mvue.prototype = {
    _proxy: function (key) {
        var self = this
        Object.defineProperty(self, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                return self._data[key]
            },
            set: function (newVal) {
                self._data[key] = newVal
            }
        })
    }
}