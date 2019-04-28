 function insertionSort(arr){
 	var len=arr.length;
 	for(var m=1;m<len;m++){
 		var key=arr[m];
 		var n=m-1;
 		while(arr[n]>key){
 			arr[n+1]=arr[n];
 			n--;
 		}
 		arr[n+1]=key;
 	}
 	return arr;
 }
 
 export   function un_insertionSort(arr){
    var len=arr.length;
    for(var m=len-2;m>-1;m--){
        var key=arr[m],
            n=m+1;
        while(arr[n]>key){
            arr[n-1]=arr[n];
            n++;
        }
        arr[n-1]=key1;
    }
    return arr1
}
