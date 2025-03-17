const http=require("http");
const fs=require("fs");

const myserver=http.createServer((req,res)=>{
    const log=`${Date.now()}:${req.url}:New Req Recieved\n`;
    fs.appendFile("log.txt",log,(err,data)=>{
        switch(req.url){
            case "/":res.end("this is home page")
            break;
            case "/about":res.end("hi i am sanjay ");
            break;
            default:res.end("404 not found")
        }
    })

    console.log(req.headers);

});

myserver.listen(5000);