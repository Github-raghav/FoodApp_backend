const mongoose=require("mongoose");

let {DBLink} =require("../secret");
// connection form.
mongoose.connect(DBLink).then(function(db){
    console.log(db);
}).catch(function(err){
    console.log("err",err);
})
//syntax
const bookingSchema=new mongoose.Schema({
user:{
    type:mongoose.Schema.ObjectId,
    required:true,
},
plan:{
    type:mongoose.Schema.ObjectId,
    required:true,
},
bookedAt:{
    type:Date,
},
priceAtThatTime:{
type:Number,
required:true
},
status:{
type:String,
enum:["pending","failed","success"],
required:true,
default:"pending"
}
})

const bookingModel=mongoose.model("bookingModel",bookingSchema);

module.exports=bookingModel