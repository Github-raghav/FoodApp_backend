const express=require("express");
const app=express();
const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser') // cookie parser is used to read the cookie.
// used to accept all the request of posts.
const rateLimit = require("express-rate-limit");
const hpp=require("hpp")
const helmet=require("helmet")
const xss=require("xss-clean")
const mongoSanitize = require('express-mongo-sanitize');
app.use(express.static('frontend'))
// line4 says - jo bhi files aapki public folder m hongi n usnko access  show krega. i.e jb inspect m jake sources m jo files show hoti h vo vhi h jo public foleder m ho.
app.use(express.json());
app.use(cookieParser());

// app.get("/",function(req,res){
    //  console.log("hello from home page");
    //  res.send("Hello From Backend");
    // })
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 ,
        message:"Too many accounts created from this IP, please try again after an hour"
    }))
    
    app.use(hpp({
        whiteList:[
            'select',
            'page',
            'sort',
            'myquery'
        ]
    }))
    app.use(helmet()) // to set http headers
   app.use(xss());
    app.use(mongoSanitize());
// frontend se jo request aati h vo yha p aati h.
// async function getusers(req,res){
//     try{
//    let user=req.body;
//    let userObj=await userModel.find();
//    res.status(200).json({
//         message:"users",
//        user:userObj
//    }) 
//     }catch(error){
//         res.status(400).json({
//             message:"couldn't get users",
//         })
//     }   
// }

const authRouter=require("./Routers/authRouter")
const userRouter=require("./Routers/userRouter")
const PlanRouter=require("./Routers/planRouter")
const reviewRouter=require("./Routers/reviewRouter")
const bookingRouter=require("./Routers/bookingRouter")
app.use("/api/plan",PlanRouter);
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/review",reviewRouter);
app.use("/api/booking",bookingRouter);

app.listen(process.env.PORT || 8080,function(){
    console.log("server started");
})

app.use(function (req, res) {
    // console.log("fullPath", fullPath);
    res.status(404).json({
        message:"page not found"
    });
})