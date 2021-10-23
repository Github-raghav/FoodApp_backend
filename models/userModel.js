const mongoose=require("mongoose");
const bcrypt =require("bcrypt")
const emailValidator=require("email-validator")
// import {DBLink} from "../secret"
let {DBLink} =require("../secret");
// connection form.
mongoose.connect(DBLink).then(function(db){
    console.log(db);
}).catch(function(err){
    console.log("err",err);
})

// schema and model 
// schema- user  architecture. i.e name m char aane chahiye phone no m numbers aane chahiye. all tht
// schema se bnta h model jisme collections aaeyi.[{},{},{}]->model

//syntax
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
      return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true,
    },
    confirmPassword:{
        type:String,
        min:6,
        // required:true,
        validate:function(){
           return this.password=this.confirmPassword
        }
    },createdAt:{
        type:Date
    },
    token:String,
    role:{
        type:String,
        enum:["admin","user","manager"],
        default:"user", 
    },
    bookings:{
     type:[mongoose.Schema.ObjectId],
     ref:"bookingModel"
    }
})

// pre function -> databse m store krne se pehle yeh function chlta h,i.e confirmedPass save krne ki jrrort ni h so usok undefined kr dia.
userSchema.pre("save",function(next){
    const salt=await bcrypt.genSalt(10);
    req.body.password=await bcrypt.hash(this.password,salt);
    this.confirmPassword=undefined
    next();
})
// creating our own methods / middleware
// through methods feature we can create our own function of entity.
userSchema.methods.resetHandler=function(password,confirmPassword){
    const salt=await bcrypt.genSalt(10);
    req.body.password=await bcrypt.hash(this.password,salt);
    this.password=password;
    this.confirmPassword=confirmPassword;
    // token ko undefined krdo taki reuse n kr paee.
    this.token=undefined
}
const userModel=mongoose.model("userModel",userSchema);

module.exports=userModel