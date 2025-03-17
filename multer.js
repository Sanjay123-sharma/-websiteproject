const fs=require("fs");
const express=require("express");
const app=express();
const multer=require("multer");

const storage=multer.diskStorage({
    destination:function(req,file,cb){
return cb(null,'./uploads');
    }
    ,
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);

    }
})
const upload=multer({storage:storage});

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('multer');
})
app.post('/upload',upload.single('cvfile'),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    return res.redirect('/')
})

app.listen(7000,()=>console.log("listen to port 7000"))