const http=require("http");
const fs=require("fs");
const url=require("url");

const myser=http.createServer((req,res)=>{
    if(req.url==="/favicon.ico") return res.end();
    const log=`${Date.now()}:${req.url}:New req recieve\n`;
    const myurl=url.parse(req.url,true);
    console.log(myurl);
    fs.appendFile("logs.txt",log,(err,data)=>{
    switch(req.url){
    case "/":res.end("welocme to home");
    break;
    case "/about":
        // query parmas start with after ?
    const username=myurl.query.myname;
    res.end("hi",`${username}`);
    break;
    default:res.end("404 not found");
};
    });
});
myser.listen(9000);