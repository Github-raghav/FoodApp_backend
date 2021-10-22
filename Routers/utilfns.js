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

module.exports.authorizeUser=function authorizeUser(roles){
    return  async function(req,res,next){
        let uid=req.uid;
        try{
            let {role}=await userModel.findById(uid);
            let isAuthorized= roles.includes(role);
            if(isAuthorized){
                next();
            }else{
                res.status(403).json({
                    message:"unauthorized user"
                });
            }
        }catch(err){
          console.log(err);
          res.status(500).json({
              message:"server error"
          })
        }
        }
    
}
