const cookieParser = require("cookie-parser");
const express=require("express");
const app=express();
const path=require('path');
const jwt=require("jsonwebtoken");
const userModel=require("./model/user");
const bcrypt=require("bcrypt")


// middleware
app.set('view engine','ejs')
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'public')));



app.get("/",(req,res)=>{
res.render('register');
    
});
app.get("/already",(req,res)=>{
    res.render('already');
        
    });
    


app.post("/create",async(req,res)=>{
    let {username,email,password}=req.body
   let user=await userModel.findOne({email});
   if(user) return res.redirect("/already");

   bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{
       let user= await userModel.create({
        username,
        email,
        password:hash
       })
       let token=jwt.sign({email:email},'shhh');
       res.cookie("token",token);
       console.log(token)
       res.redirect('/login');
    })
   })
})

app.get("/login",(req,res)=>{
    res.render('login');
        
    });
    app.get("/donot",(req,res)=>{
        res.render('donot');
            
        });
    
      
app.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});
    if(!user) res.redirect("/donot");
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email:email},'shhh')
            res.cookie("token",token);
            console.log(token)
            res.redirect("/home")
            
        }else{
            res.redirect("/login");
        }
    })
})

app.get("/home",(req,res)=>{
    res.render('home');
        
    });
app.get("/logout",(req,res)=>{
    
        res.cookie("token","")
        res.redirect("/login")
            
        });
    
app.listen(9000,()=>console.log("listen to port 9000"));
