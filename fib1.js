const http = require('http');
const server = http.createServer();
const fib=function(num) {
	if (num <= 1) return 1;
	return fib(num-1) + fib(num-2);
}
server.on('request',function(req,res){
  const url = req.url.toString().substr(1);
	console.log("URL="+url);
  let n=parseInt(url);
  let str;
  if(isNaN(n) || n<=0){
    str="illegal value "+url;
  }else{
    console.log("Start Fib"+n);
    const f=fib(n);
    str="fib("+n+")="+f;
    console.log("Return "+f);
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(str);
});
server.listen(3333);
console.log("server listening ...");
