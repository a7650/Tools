function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function shuffle(arr){
    var arr = [...arr];
    let len = arr.length;
    for(let i = 0 ; i < len ; i++){
        let t = getRandom(0,i);
        let m = arr[t];
        arr[t] = arr[i];
        arr[i] = m;
    }
    return arr; 
}
