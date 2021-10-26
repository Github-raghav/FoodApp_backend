const express=require("express");
const bookingRouter=express.Router();
const protectRoute=require("./authHelper")
const bookingModel=require("../models/bookingModel")
const reviewModel=require("../models/reviewModel")
const userModel=require("../models/userModel")
const factory=require("./externalServices/factory")
const Razorpay=require('razorpay')
const {KEY_ID,KEY_SECRET}= require("../secret")
// console.log(KEY_ID);
// console.log(KEY_SECRET);
var razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  })
  
const deletebooking=async function(req,res){
    try{
    let booking=await bookingModel.findByIdAndDelete(req.body.id);
    let userId=booking.user;
    let user=await userModel.findById(userId);
    let idxOfReview=user.reviews.indexof(booking["_id"]);
    user.booking.slice(idxOfReview,1);
    await user.save();
    res.status(200).json({
        message:"booking deleted",
        booking:booking
    })
    }catch(err){
    res.status(500).json({
        message:err.message
    })
    }
}
const initiateBooking=async function(req,res){
    try{
    let booking=await bookingModel.create(req.body);
    let bookingId=booking["_id"];
    let userId=req.body.user
    let user=await userModel.findById(userId)
    user.booking.push(bookingId);
    await user.save();
    const payment_capture=1;
    const currency="INR"
    const options={
        amount:500,
        currency,
        receipt:`rs_${bookingId}`,
        payment_capture
    }
    const response=await razorpay.orders.create(options)
    console.log(response);
    res.status(200).json({
    id:response.id,
    currency:response.currency,
    amount:response.amount,
    booking:booking,
    message:"booking created"
    })
    }catch(err){
     res.status(500).json({
         message:err.message
     })
    }
}
async function verifyPayment(req,res){
    const secret=KEY_SECRET;
    const shasum=crypto.createHmac("sha256",secret);
    const digest=shasum.digest("hex");
    console.log(digest,req.headers["x-razorpay-signature"]);

    if(digest===req.headers["x-razorpay-signature"]){
        console.log("request is legit");
        res.status(200).json({
            message:"ok"
        })
    }else{
        res.status(403).json({message:"Invalid"})
    }
}
const getbooking=factory.getElements(bookingModel);
// const deleteReview=factory.deleteElements(bookingModel);
const updatebooking=factory.updateElements(bookingModel);
const getbookingById=factory.getElementById(bookingModel);
bookingRouter.use(protectRoute);
bookingRouter.route("/verification").post(verifyPayment)
bookingRouter
          .route("/:id")
          .get(getbookingById)
          .patch(protectRoute,updatebooking)
          .delete(protectRoute,deletebooking)

bookingRouter 
         .route("/")
         .get(getbooking)
         // create-->when payment is done
         .post(protectRoute,initiateBooking)          

         module.exports=bookingRouter;