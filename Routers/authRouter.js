const express=require("express");
const { Mongoose } = require("mongoose");
const userModel=require("../models/userModel")
const jwt=require("jsonwebtoken");
 const {JWT_KEY, JWT_TOKEN}=require("../secret")
const authRouter=express.Router();
const bcrypt = require("bcrypt");
// bcrypt is npm package used for security reasons used to store password by hashing.
let emailSender=require("./externalServices/emailSender")
// const resetHandler=require("../models/userModel")

authRouter
         .post("/signup",setCreatedAt,signupUser) // here setcreatedat acts as a middleware
         .post("/login",loginUser)
         .post("/forgetPassword",forgetPassword)
         .post("/resetPassword",resetPassword);

         // middleware-->middleware is aatma of express i.e very useful.
function setCreatedAt(req,res,next){
    let body=req.body;
    let length=Object.keys(body).length;
    if(length==0)return res.status(400).json({
        message:"cannt create user when body is empty"
    })
 //next is function in which u can do anything u want.
 req.body.createdAt=new Date().toISOString();
 next();
}
         async function signupUser(req,res){
            try{
                // let {email,password,name}=req.body;
                let userObj=req.body;
                let user=await userModel.create(userObj);
                console.log("user", user);
                // user.push({
                //     email,password,name
                // })
                res.status(200).json({
                    message:"user created",
                    createdUser:user
                })
            }catch(error){
               res.status(500).json({
                   message:error.message
                })
                console.log(error)
            }
        }
         async function loginUser(req,res){
             
             try{
            let {email,password}=req.body;
            // if(req.body.email){
                console.log(email);
            let user=await userModel.findOne({email})
            
               if(user){
                   let areEqual=await bcrypt.compare(password,user.password)
                   if(areEqual){
                    // creating jsonwebtoken.
                    //    header
                let payload=user["_id"];
              let token= jwt.sign({id:payload},JWT_KEY);
                       res.cookie("jwt",token,{httpOnly:true});
                     return  res.status(200).json({
                           message:"user loggedin",
                           user:user
                       })       
                   }else{
               return  res.status(401).json({
                    message:"incorrect email or password"
                })
               }
            }else{
                return res.status(401).json({
                    message:"user not found with creds"
                })
            }
            // }else{
            //     return res.status(403).json({
            //         message:"email not present"
            //     })
            // }
        }catch(error){
             return res.status(500).json({
                message:error.message
            })
            console.log(error);
        }
  
        }
// working of forget password (there r 2 pages forget and reset)-> agr koi password bhul gya h ,toh recovery options 2 email or phone.
// fir jb otp chla jaega  via mail or phone , then reset wala page khulega.
// 
        async function forgetPassword(req,res){
            try{
                let email=req.body.email; // email nikal lia body m se.
                let user=await userModel.findOne({email});
                if(user){
                    // code  for generating 4 digit random otp number
                    let seq=(Math.floor(Math.random()*10000)+10000).toString().substring(1);
                    console.log(seq);
                    await userModel.updateOne({email},{seq});
                    let newuser=await userModel.findOne({email});
                     await emailSender(seq,user.email);
                    console.log(newuser);
                    // if(user?.token){
                        return res.status(200).json({
                            message:"user token sent to your email" + seq

                        })
                    // }else{
                    //     return res.status(404).json({
                    //         message:"user not found"
                    //     })
                    // }
                }else{
                    return res.status(404).json({
                        message:"user not found"
                    })
                }
            }catch(err){
                return res.status(400).json({
                    message:err.message
                })
            }
        }
        async function resetPassword(req,res){
            try{
                let{token,password,confirmPassword}=req.body;
                let user=await userModel.findOne({token});
                if(user){
                    // let user=await userModel.findOne({token});
                    // if(user){
                       user.resetHandler(password,confirmPassword);
                        //saving user in database
                        await user.save();
                        let newuser=await userModel.findOne({email:user.email})
                        res.status(200).json({
                            message:"user password changed",
                            user:newuser
                        })
                    // }else{
                    //     return res.status(404).json({
                    //         message:"incorrect token"
                    //     })
                    // }
                }else{
                    return res.status(404).json({
                        message:"user not found"
                    })
                }
            }catch(err){
                res.status(404).json({
                    message:err.message
                })
            }
        }
        module.exports=authRouter