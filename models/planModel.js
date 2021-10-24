const mongoose=require("mongoose");
const emailValidator=require("email-validator")
// import {DBLink} from "../secret"
const {APP_PASSWORD}=require("../secret")
let DBLink=`mongodb+srv://admin:${APP_PASSWORD}@cluster0.utwxn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// let {DBLink} =require("../secret");
// connection form.
mongoose.connect(DBLink).then(function(db){
    console.log("plans connected");
    //console.log(db);
}).catch(function(err){
    console.log("err",err);
})

// schema and model 
// schema- user  architecture. i.e name m char aane chahiye phone no m numbers aane chahiye. all tht
// schema se bnta h model jisme collections aaeyi.[{},{},{}]->model

//syntax
const planSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"kindly enter the name"],
        unique:true,
        maxlength:[40,"Your plan length is more than 40 character"]
    },
    duration:{
        type:Number,
        required:[true,"You Need to provide duration"]
    },
    price:{
        type:Number,
        required:true,
    
    },
    ratingsAverage:{
        type:Number,
    },
    discount:{
        type:Number,
        validate:{
            validator:function(){
                return this.discount<this.price;
            },
            message:"Discount must be less than actual price",
        },
    },
    planImages:{
        type:[String]
    },
    reviews:{
        //array of object id.
        // id ki through pura object chahie.below
    type:[mongoose.Schema.ObjectId],  
     ref:"reviewModel"
    },
   averageRating:Number,

})

const planModel=mongoose.model("PlanModel",planSchema);

module.exports=planModel