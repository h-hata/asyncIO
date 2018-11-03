const http = require('http');
const amqp = require('amqplib/callback_api');
const server = http.createServer();
let chan;
let count=0;
let tasks=[];
const q1 = 'work1';
const q2 = 'work2';


var asyncFib=function(m,priv,cb){
  count++;
  tasks.push({"n": count, "priv": priv,"m":m,"cb":cb});
  let cmd=JSON.stringify({"m":m,"n":count});
  let b=new Buffer(cmd);
  chan.assertQueue(q1,{durable:true});
  chan.sendToQueue(q1,b,{persistent: true});
	return count;
}

server.on('request',function(req,res){
  const url = req.url.toString().substr(1);
  let m=parseInt(url);
  if(isNaN(m) || m<=0){
    let str="illegal value "+url;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(str);
  }else{
    console.log("Start request %d",m);
    c=asyncFib(m,res,function(m,res,n,f){
        console.log("callback c=%d m=%d f=%d",n,m,f);
        str="fib3("+m+")="+f;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(str);
      }
    );
    console.log("Start(%d) Fib(%d)",c,m);
  }
});
server.listen(3333);
console.log("server listening ...");
amqp.connect('amqp://genpub:rabbitmq@localhost:5672', function(err, conn) {
	conn.createChannel(function(err, ch) {
		console.log("amqp channel established");
		chan=ch;
		ch.assertQueue(q2, {durable: true});
		ch.consume(q2, function(msg) {
			var data = JSON.parse(msg.content);
			console.log("f:"+data.f+",n:"+data.n);
      for(var i=0; i<tasks.length; i++) {
          if(tasks[i].n == data.n) {
            console.log('response for #('+data.n+')');
            tasks[i].cb(tasks[i].m,tasks[i].priv,tasks[i].n,data.f)
            tasks.splice(i, 1);
            break;
          }
      }
		}, {noAck:true});
  });
});
console.log("amqp setup ...");
