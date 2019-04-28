function ajax({data,type,url,params,success,failed,isAsync}){
	const xhr = new XMLHttpRequest()
	const type = type.toLowerCase()
	let _data = ""
	for(let i in data){
		let val = data[i] === undefined ? '' : data[i]
		_data += `&${encodeURIComponent(i)}=${encodeURIComponent(val)}`
	}
	_data = _data?_data.substring(1):''
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			let status = xhr.status
			if((status>=200&&status<300)||status==304){
				if(typeof success == 'function'){
					success()
				}else{
					console.log('success function')
				}
			}
		}
	}
	if(type === 'get'){
		url += (url.indexOf('?')>0?"&":"?") + _data + "&_rand=" + Math.random() 
		xhr.open("get",url,isAsync==='undefined'?isAsync:true)
		xhr.send(null)
	}else if(type === 'post'){
		xhr.open("post",url,isAsync==='undefined'?isAsync:true)
		xhr.setRequestHeader("ContentType","application/x-www-form-urlencoded")
		if(typeof params === 'object'){
			for(let p in params){
				xhr.setRequestHeader(p,params[p])
			}
		}
		xhr.send(_data)
	}
}