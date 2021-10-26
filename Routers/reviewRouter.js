const express=require("express");
const ReviewRouter=express.Router();
const protectRoute=require("./authHelper")
const ReviewModel=require("../models/reviewModel")
const planModel=require("../models/planModel")
const factory=require("./externalServices/factory")


// const createReview=factory.createElement(ReviewModel);
const createReview=async function(req,res){
    //create krte time entry put hoegyi + plan m jake uski avg rating bhadani h 
    //or apni id bhi store krvani h 
    try{
    let review=await ReviewModel.create(req.body)  // review bnaya usme user bhi dala h plan bhi
    console.log("review",review);
    let planId=review.plan
    let plan=await planModel.findById(planId);
    plan.reviews.push(review["_id"]);
    // updating avg rating 
    if(plan.averageRating){
      let sum=plan.averageRating * plan.reviews.length;
      let finalAvgRating=(sum+review.rating)/(plan.review.length + 1);
      plan.averageRating=finalAvgRating;
    }else{
        //firrst tiime plan bnega toh koi prevoius rating ni hogi .therefore abhi wali rating is only current rating.
        plan.averageRating=review.rating;
    }
    //saving the plan
    await plan.save();
    res.status(200).json({
        message:"review created",
        review:review
    })
    }
    catch(err){
    res.status(500).json({
        message:err.message
    })
    }
};
const deleteReview=async function(req,res){
    try{
    let review=await ReviewModel.findByIdAndDelete(req.body.id);
    let planId=review.plan;
    let plan=await planModel.findById(planId);
    let idxOfReview=plan.reviews.indexof(review["_id"]);
    plan.review.splice(idxOfReview,1);
    await plan.save();
    res.status(200).json({
        message:"review deleted",
        review:review
    })
    }catch(err){
    res.status(500).json({
        message:err.message
    })
    }
}

const getReview=factory.getElements(ReviewModel);
// const deleteReview=factory.deleteElements(ReviewModel);
const updateReview=factory.updateElements(ReviewModel);
const getReviewById=factory.getElementById(ReviewModel);
ReviewRouter.use(protectRoute);

ReviewRouter
          .route("/:id")
          .get(getReviewById)
          .patch(protectRoute,updateReview)
          .delete(protectRoute,deleteReview)

ReviewRouter 
         .route("/")
         .get(getReview)
         .post(protectRoute,createReview)          

         module.exports=ReviewRouter;