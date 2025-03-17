// require mongoose module
const mongoose=require("mongoose");

// built connection of node to mongo db
mongoose.connect(process.env.MONGO_URL="mongodb://localhost:27017/website").then(()=>console.log("database connected")).catch((e)=>{console.log(e)});


// create userSchema that defines logical structure of the database.
const userSchema=mongoose.Schema({
username:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}

});

// exports the whole module to main file
module.exports=mongoose.model('user',userSchema);