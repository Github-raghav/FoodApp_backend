const mongoose=require("mongoose");
// const emailValidator=require("email-validator")
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
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review can't be empty"],
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Review must contain some rating"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.objectId,  // hume user ki id store krni h sari review m
        ref:"userModel",// collection ka naam jha se id aaegyi
        // ref will be used in populate.
        //populate - ek id se aagr pura/kuch part user chahie 
        require:[true,"Review must belong to a user"]
    },
    plan:{
        type:mongoose.Schema.objectId,
        ref:"PlanModel",
        required:[true,"Review must belong to a plan"]
    }
   
})

const reviewModel=mongoose.model("reviewModel",reviewSchema);

module.exports=reviewModel