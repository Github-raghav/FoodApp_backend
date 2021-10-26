const jwt=require("jsonwebtoken");
const {JWT_KEY}=process.env || require("../secret")
function protectRoute(req,res,next){
    // let flag=req.cookie.test;
    try{
      if(req.cookies.jwt){
          console.log(req.cookies.jwt);
          let isVerified=jwt.verify(req.cookies.jwt,JWT_KEY)
          if(isVerified){
              console.log(isVerified);
            let userId=isVerified.id
            req.userId=userId;
              next();
          }
      }else{
          res.status(401).json({
              message:"you are not allowed"
          })
      }
    }catch(error){
        res.status(500).json({
            message:error.message
        })
        console.log(error);
    }
}
module.exports=protectRoute;