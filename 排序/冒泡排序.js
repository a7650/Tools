
function bubbleSort(arr){
	var len=arr.length;
	while(len>1){
		for(var i=0;i<len-1;i++){
			if(arr[i]>arr[i+1]){
				var m=arr[i];
				arri[i]=arr[i+1];
				arr[i+1]=m;
			}
		}
		len--;
	}
	return arr;
}

var a=[5,4,3,2,1,7,8,9];
console.log(bubbleSort(a));
