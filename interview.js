const express=require("express");
const app=express();
const data=require("./package.json");


app.get("/",(req,res)=>{
  res.setHeader("x-name","sanju")
    res.cookie("token","sanju")
    return res.json(data);

})




app.listen(3000);