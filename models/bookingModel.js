const mongoose=require("mongoose");

let {APP_PASSWORD} =require("../secret") || process.env ;
let DBLink=`mongodb+srv://admin:${APP_PASSWORD}@cluster0.utwxn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// connection form.
mongoose.connect(DBLink).then(function(db){
    // console.log(db);
    console.log("booking DB");
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