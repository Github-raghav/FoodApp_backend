const userModel=require("../models/userModel")

module.exports.bodyChecker=function bodyChecker(req,res,next){
    console.log("reached bodychecker");
    let isPresent=Object.keys(req.body).length;
    console.log("isPresent",isPresent);
    if(isPresent){
        next();
    }else{
        res.send("Kind send details in body");
    }
}

module.exports.authorizeUser=function (roles){
    return  async function(req,res,next){
        let {userId}=req;
        // console.log(req);
        console.log(userId);
        try{
            let user=await userModel.findById(userId);
            let isAuthorized= roles.includes(user.role);
            if(isAuthorized){
                // req.user=user
                next();
            }else{
                res.status(403).json({
                    message:"unauthorized user"
                });
            }
        }catch(err){
          console.log(err);
          res.status(500).json({
              message:err.message
          })
          console.log(err);
        }
        }
    
}
