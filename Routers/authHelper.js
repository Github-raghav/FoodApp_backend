const jwt=require("jsonwebtoken");
const {JWT_KEY}=require("../secret")
function protectRoute(req,res,next){
    // let flag=req.cookie.test;
    try{
      if(req.cookie.jwt){
          let isVerified=jwt.verify(req.cookies.jwt,JWT_KEY)
          if(isVerified){
              console.log(isVerified);
            req.uid=isVerified.id
              next();
          }
      }else{
          res.status(401).json({
              message:"you are not allowed"
          })
      }
    }catch(error){
        res.status(500).json({
            message:"server error"
        })
    }
}
module.exports=protectRoute;