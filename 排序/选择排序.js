function selectSort(arr){
	var len=arr.length;
	var res=[];
	for(var m=0;m<len-2;m++){
		for(n=m+1;n<len-1;n++){
			if(arr[n]<arr[m]){
				var x=arr[n];
				arr[n]=arr[m];
				arr[m]=x;
			}
		}		
	}
	return arr;
}
