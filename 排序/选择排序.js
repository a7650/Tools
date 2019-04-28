function selectSort(arr){
	var len=arr.length;
 	for(var m=0;m<len-1;m++){
		for(n=m+1;n<len;n++){
			if(arr[n]<arr[m]){
				var x=arr[n];
				arr[n]=arr[m];
				arr[m]=x;
			}
		}		
	}
	return arr;
}
