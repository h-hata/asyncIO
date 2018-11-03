var amqp = require('amqplib/callback_api');
const fib=function(num) {
	if (num <= 1) return 1;
	return fib(num-1) + fib(num-2);
}

amqp.connect('amqp://gensub:rabbitmq@localhost:5672', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'work1';
		var q2 = 'work2';
		ch.assertQueue(q, {durable: true});
		ch.prefetch(1);//1メッセージ受け取ったら受信の一時停止を通知
		ch.consume(q, function(msg) {
			console.log(msg.content.toString());
			var data = JSON.parse(msg.content);
			console.log("m:"+data.m+",n:"+data.n);
			var f=fib(data.m);
			console.log("f:"+f);
			ch.assertQueue(q2,{durable:true});
			var resp=JSON.stringify({"f":f,"n":data.n});
			var b=new Buffer(resp);
			console.log(resp);
			ch.sendToQueue(q2,b,{persistent: true});
 	    ch.ack(msg);//再び受信を再開
		}, {noAck: false});
		});
});
