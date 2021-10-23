const express=require("express");
const planRouter=express.Router();
const PlanModel=require("../models/planModel");
const protectRoute = require("./authHelper");
const factory=require("./externalServices/factory");
const {bodyChecker,authorizeUser}=require("./utilfns")

const createPlan=factory.createElement(PlanModel);
const getPlans=factory.getElements(PlanModel);  
const updatePlan=factory.updateElements(PlanModel);
const getPlanById=factory.getElementById(PlanModel);
const deletePlan=factory.deleteElements(PlanModel);
//   middleware-->middleware is aatma of express i.e very useful.
planRouter.use(protectRoute)
planRouter
         .route("/") // here setcreatedat acts as a middleware
         .post(bodyChecker,authorizeUser(["admin"]),createPlan)
         .get(protectRoute,authorizeUser(["admin","ce"]),getPlans)
         //****************************/
 planRouter
         .route("/:id")
         .get(getPlanById)
         .patch(bodyChecker,authorizeUser(["admin"]),updatePlan)
         .delete(deletePlan);
planRouter.route("/topplans").get(getTop3Plans)


async function getTop3Plans(req,res){
        try {
         let plans=await PlanModel.find().limit(3).sort({
                 averageRating:-1
         }).populate({path:'reviews',select:'review rating'})
         console.log(plans);
         res.status(200).json({
                 plans
         })
        } catch (error) {
         res.status(200).json({
           message:err.message
         })       
        }
}

//  async function createPlan(req,res){
//    try{
//     let plan=req.body;
//     if(plan){
//         let plan=PlanModel.create(plan);
//         res.status(200).json({
//             plan:plan
//         })
//     }
//    }catch(err){
//        res.status(200).json({
//          message:"kindly enter data"
//        })
//    }
// }
// async function getPlans(req,res){
//     try{
//         // sometimes there are tons of plans so fetching them would be problem
//         // so we have to fetch efficiently i.e according to need to user
//         //1. filter 
//         //2.name price
//         //3. sorting
//         console.log(req.query);
//         let ans=JSON.parse(req.query.myquery);

//     let plansPromise=await PlanModel.find(ans);
//     let sortField=req.query.sort
//      let sortQueryPromise=await plansPromise.sort(`-${sortField}`); //sorting
//    let params=req.query.select.split("%").join(" ");
//    let filteredQuery=sortQueryPromise.select(`${params} - _id`);
// //    let result=await filteredQuery;
//     //pagination.
//     //skip and limit 
//     let page=Number(req.query.page) || 1;
//     let limit=Number(req.query.limit) || 3;
//     let toSkip=(page-1)*limit;
//     let paginatedResultPromise=filteredQuery.skip(toSkip).limit(limit);
//     let result=  await  paginatedResultPromise
//     res.status(200).json({
//         message:"list of all the plans",
//         plans:result
//     })
//     }catch(err){

//     }
// }

// function updatePlan(req,res){
//     try{
//         await PlanModel.updateOne({name}.req.body);
//         let plan=await PlanModel.findOne({name});
//         res.status(200).json(plan);
//     }catch(err){
//         res.status(200).json({
//             message:err.message
//         })
//     }
// }


// async function getPlanById(req,res){
//  try{
//      let id=req.params.id;
//      let plan=await PlanModel.getElementById(id);
//      res.status(200).json({
//          plan:plan
//      })
//  }catch(err){
//      console.log(err);
//      res.status(500).json({
//          message:"Server error"
//      })
//  }
// }
        module.exports=planRouter