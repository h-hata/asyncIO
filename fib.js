const fib=function(num) {
	if (num <= 1) return 1;
	return fib(num-1) + fib(num-2);
}
var m=0;
if(process.argv.length == 3){
	m=parseInt(process.argv[2]);
}
console.log("fib(%d)=%d",m,fib(m));


