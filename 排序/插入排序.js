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
 
