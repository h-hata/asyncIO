const fs=require("fs");
let text;
console.log("-----------Start readFileSync");
text=fs.readFileSync("test.txt","utf-8");
console.log("-----------Return readFileSync");
console.log(text);
console.log("-----------Start readFile");
fs.readFile("test.txt","utf-8",function(err,data){
	console.log("******callback");
	console.log(data);
	console.log("******error:"+err);
});
console.log("-----------Return readFile");
