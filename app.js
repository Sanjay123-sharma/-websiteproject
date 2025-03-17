/*
// require necessary Modules 

const cookieParser = require("cookie-parser");
const express=require("express");
const app=express();
const path=require('path');
const jwt=require("jsonwebtoken");
const userModel=require("./model/user");
const bcrypt=require("bcrypt")


// middleware 

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    console.log("middlewares executed properly");
    next();
})

// server side rendering

app.get("/",(req,res)=>{
console.log(req.headers);
res.render('register');
    
});

app.get("/already",(req,res)=>{
    console.log(req.headers);
    res.render('already');
        
    });
    
// create a user

app.post("/create",async(req,res)=>{
    let {username,email,password}=req.body
   let user=await userModel.findOne({email});
   if(user) return res.status(301).redirect("/already");

   bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{
       let user= await userModel.create({
        username,
        email,
        password:hash
       });

       let token=jwt.sign({email:email},'shhh');
       res.cookie("token",token);
       console.log(token)
       res.status(301).redirect('/login');
    })
   })
})


// login a user

app.get("/login",(req,res)=>{
    console.log(req.headers);
    res.render('login');
        
    });

app.get("/donot",(req,res)=>{
        console.log(req.headers);
        res.render('donot');
            
        });
    
      
app.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});
    if(!user) res.status(301).redirect("/donot");

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email:email},'shhh')
            res.cookie("token",token);
            console.log(token)
            res.status(301).redirect("/home")
            
        }else{
            res.status(401).send("Password not match")
        }
    })
})


app.get("/home",(req,res)=>{
    console.log(req.headers);
    res.render('home');
        
    });


// logout a user 
app.get("/logout",(req,res)=>{
    console.log(req.headers);
        res.cookie("token","")
        res.status(301).redirect("/login")
            
        });

app.get("/data",async(req,res)=>{
const users=await userModel.find();
return res.status(200).json(users);
})

// verify api with postman

app.get("/data/delete",async(req,res)=>{
    await userModel.deleteMany();
    return res.status(200).send("users delete successfully");
    });


app.get("/data/update",async(req,res)=>{
  await userModel.updateOne({username:"sanjay"},{$set:{username:"sanju"}});
  return res.status(200).send("user update successfully");
})


// listen to port  

const port=9000;
app.listen(port,()=>console.log("listen to port 9000"));

*/
// require necessary Modules 
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require('path');
const jwt = require("jsonwebtoken");
const userModel = require("./model/user");
const bcrypt = require("bcrypt");

require("dotenv").config();

// middleware 

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log("middlewares executed properly");
    next();
});

// Authorization middleware
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, 'shhh');
        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized: Invalid token");
    }
};

// server side rendering

app.get("/", (req, res) => {
    console.log(req.headers);
    res.render('register');

});

app.get("/already", (req, res) => {
    console.log(req.headers);
    res.render('already');

});

// create a user

app.post("/create", async (req, res) => {
    let { username, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(301).redirect("/already");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                email,
                password: hash
            });

            let token = jwt.sign({ email: email }, 'shhh');
            res.cookie("token", token);
            console.log(token);
            res.status(301).redirect('/login');
        });
    });
});

// login a user

app.get("/login", (req, res) => {
    console.log(req.headers);
    res.render('login');

});

app.get("/donot", (req, res) => {
    console.log(req.headers);
    res.render('donot');

});

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) res.status(301).redirect("/donot");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email }, 'shhh');
            res.cookie("token", token);
            console.log(token);
            res.status(301).redirect("/home");

        } else {
            res.status(401).send("Password not match");
        }
    });
});

app.get("/home", authenticate, (req, res) => { // Added authenticate middleware
    console.log(req.headers);
    res.render('home');

});

// logout a user 
app.get("/logout", (req, res) => {
    console.log(req.headers);
    res.cookie("token", "");
    res.status(301).redirect("/login");

});

app.get("/data", authenticate, async (req, res) => { //Added authenticate middleware
    const users = await userModel.find();
    return res.status(200).json(users);
});

// verify api with postman

app.get("/data/delete", authenticate, async (req, res) => { //Added authenticate middleware
    await userModel.deleteMany();
    return res.status(200).send("users delete successfully");
});

app.get("/data/update", authenticate, async (req, res) => { //Added authenticate middleware
    await userModel.updateOne({ username: "sanjay" }, { $set: { username: "sanju" } });
    return res.status(200).send("user update successfully");
});

// listen to port  

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log("listen to port 9000"));