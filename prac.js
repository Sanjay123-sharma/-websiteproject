const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const fs=require("fs");
const path=require("path");
const users=require("./model/user")
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')))
app.use((req,res,next)=>{
    console.log("middleware");
    next();
});


app.get("/",(req,res)=>{
   console.log( req.headers);
    res.render('home');

});

app.get("/users",async(req,res)=>{
    res.setHeader("x-name","sanju")
    const allusers=await users.find();
    res.json(allusers);
    const token=jwt.sign({allusers:allusers},'sss');
    res.cookie("token",token)
})











app.listen(9000,()=>console.log("listen to port 9000"))