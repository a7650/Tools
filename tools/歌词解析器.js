//歌词解析器
export function lyricParser(lyricStr, fn) {
    this.line = -1;
    this.lyricStr = lyricStr;
    this.fn = fn;
    this.curTime = 0;
    this.playing = true;
    this.timer = null;
    // this.title = this.lyricStr.match(/\[ti:(.+?)\]/)[1];
    // this.singer = this.lyricStr.match(/\[ar:(.+?)\]/)[1];
    // this.album = this.lyricStr.match(/\[al:(.+?)\]/)[1];
    this.noLyric = false;
    this.textContent = this.parser(lyricStr);
    this.lyricDuration = this.textContent.length>0?this.textContent[this.textContent.length - 1].time:0;
}

lyricParser.prototype.parser = function (lyric) {
    let self = this,
        textContent = [];
    let textArr = this.lyricStr.match(/(\[\d{2}:\d{2}\.\d{2}\])(.[^\[\]]*)?/g);
    if(textArr&&textArr.length){
        textArr.forEach(function (c, i) {
            /^(\[\d{2}:\d{2}\.\d{2}\])(.[^\[\]]*)?$/.exec(c);
            let lineItem = { line: i + 1, text: RegExp.$2, time: self.timeParser(RegExp.$1) }
            textContent.push(lineItem)
        })
    }else{
        self.noLyric = true;
    }
    return textContent
}

lyricParser.prototype.timeParser = function (timeStr) {
    let arr = timeStr.match(/\[(.+?)\]/)[1].split(/[^0-9]+/);
    return arr[0] * 60000 + arr[1] * 1000 + arr[2] * 10
}

lyricParser.prototype.play = function (startTime = 0) {
    this.playing = true;
    this.line++;
    let curLine = this.textContent[this.line],
    self = this;
    self.timer && clearTimeout(self.timer);
    if (curLine) {
        self.timer = setTimeout(function () {
            if (self.playing) {
                self.curTime = curLine.time;
                self.fn(curLine.line, curLine.text);
                self.play(self.curTime);
            } else {
                self.line--;
            }
        }, curLine.time - startTime);
    }
}

lyricParser.prototype.pause = function () {
    this.playing = false;
}

lyricParser.prototype.seek = function (seekTime = 0) {
    let self = this;
    self.timer && clearTimeout(self.timer);
    self.timer = null;
    if(seekTime===0){
        this.line = -1;
    }else if(seekTime>=this.lyricDuration){
        let len = this.textContent.length-1;
        this.line = len;
        this.fn(this.textContent[len].line,this.textContent[len].text);
    }else{
        self.curTime = seekTime;
        self.textContent.reduce(function (pre, cur, i, arr) {
            try {
                if (seekTime >= pre.time && seekTime < cur.time) {
                    self.line = i - 1;
                    self.fn(arr[i - 1].line, arr[i - 1].text)
                    throw new Error('break')
                } else {
                    return cur
                }
            } catch (e) {
                return
            }
        })
    }
    return this
}