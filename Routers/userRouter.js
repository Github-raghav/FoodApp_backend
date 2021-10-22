const express=require("express");
const userModel=require("../models/userModel")
const userRouter=express.Router();
const protectRoute=require("../Routers/authHelper");
const factory=require("./externalServices/factory")
const bodyChecker=require("../Routers/utilfns");
const authorizeuser=require("./utilfns")
userRouter.route("/")
       .post(bodyChecker,protectRoute,authorizeuser(["admin"]),createUser)
       .get(protectRoute,authorizeuser(["admin"]),getusers) // protectRoute is a middleware .  it works as privateRouting as in react
userRouter.route("/:id")
       .get(getUserById)
       .patch(bodyChecker,authorizeuser(["admin"]),updateUser)
       .delete(bodyChecker,authorizeuser(["admin"]),deleteUser)
       

    //    async function getusers(req,res){
    //     try{
    
    //    let userObj=await userModel.find();
    //    res.status(200).json({
    //        message:"users",
    //        user:userObj
    //    }) 
    //     }catch(error){
    //         res.status(400).json({
    //             message:"couldn't get users",
    //         })
    //     }
        
    // }
//   async  function createUser(req,res){
//         try{
//      let user=req.body;
//      if(user){
//          user=await userModel.create(plan);
//          res.status(200).json({
//              user:user
//          })
//      }else{
//          res.status(200).json({
//              message:"Kindly enter data"
//          });
//      }
//         }catch(err){
//        console.log(err);
//        res.status(500).json({
//            message:"Server error"
//        })
//         }
//     }
const createUser=factory.createElement(userModel);
const getusers=factory.getElements(userModel);
const deleteUser=factory.deleteElements(userModel);
const updateUser=factory.updateElements(userModel);
const getUserById=factory.getElementById(userModel);
    // async function deleteUser(req,res){
    // //     let{email}=req.body;
        
    // //      await userModel.findOneAndDelete(email,function(err,res){
    // //          if(err){
    // //           res.status(400).json({
    // //               message:"user doesn't exist"
    // //           })
    // //          }else{
    // //             res.status(200).json({
    // //                 message:"user deleted"
    // //             })
    // //          }
    // //      })
     
     
    // }
    // function updateUser(req,res){
    //     let obj=req.body;
    //     for(let key in obj){
    //         user[key]=obj[key];
    //     }
    // }
    // async function getUserById(req,res){
    //    let{id}=req.body;
    //  await userModel.findById(id,function(err,user){
    //      if(err){
    //          console.log(err);
    //      }else{
    //          res.status(200).json({
    //              id:id
    //          })
    //      }
    //  })
    // }
    
    // function authorizeuser(rolesArr){
    //     return async function(req,res,next){
    //     let uid=req.uid;
    //     let {role}=await userModel.findById(uid);
    //     let isAuthorized= rolesArr.includes(role);
    //     if(isAuthorized){
    //         next();
    //     }else{
    //         res.status(403).json({
    //             message:"unauthorized user"
    //         });
    //     }
    //     }
    // }

       module.exports=userRouter