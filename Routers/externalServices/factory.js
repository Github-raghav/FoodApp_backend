module.exports.createElement= function(ElementModel){
    return   async  function (req,res){
        try{
            let element=req.body
            if(element){
          element=await ElementModel.create(element);
         res.status(200).json({
             element:element
         })
     }else{
         res.status(200).json({
             message:"Kindly enter data"
         });
     }
        }catch(err){
       console.log(err);
       res.status(500).json({
           message:"Server error 1"
       })
       console.log(err);
        }
    }
}

module.exports.getElements=function(ElementModel){
    return async function (req,res){
        try{
            // sometimes there are tons of plans so fetching them would be problem
            // so we have to fetch efficiently i.e according to need to user
            //1. filter 
            //2.name price
            //3. sorting
            console.log(req.query);
            let ans;
            //query
            if(req.query.myquery){
                 ans=JSON.parse(req.query.myquery);

            }else{
               ans=ElementModel.find(); // find agr empty ho toh sara return krta h
            }
            //sort
            if(req.query.sort){
                ans=ans.sort(req.query.sort)
            }
            //select
            if(req.query.select){
            let params=req.query.split("%").join(" ");
            ans=ans.select(params);
            }
        //  if(req.query.page && req.query.limit){
              
        //  }
    //     let plansPromise=await ElementModel.find(ans);
    //     let sortField=req.query.sort
    //      let sortQueryPromise=await plansPromise.sort(`-${sortField}`); //sorting
    //    let params=req.query.select.split("%").join(" ");
    //    let filteredQuery=sortQueryPromise.select(`${params} - _id`);
    //    let result=await filteredQuery;
        //pagination.
        //skip and limit 
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3;
        let toSkip=(page-1)*limit;
         ans=ans.skip(toSkip).limit(limit);
        let result=  await ans;
        res.status(200).json({
            message:"list of all the plans",
            plans:result
        })
        }catch(err){
      res.status(520).json({
          message:err.message
      })
        }
    }  
}

module.exports.deleteElements=function(ElementModel){
    return async function (req,res){
        let {id}=req.body;
         try{
          let element= await ElementModel.findByIdAndDelete({id}.req.body);
            //  let element=await ElementModel.findOne({_id:id});
             if(!element){
             res.status(404).json({
                 message:"resource not found"
             })
             }else{
                 res.status(200).json(element);
             }
         }catch(err){
             res.status(200).json({
                 message:err.message
             })
         }
     }
}

module.exports.updateElements=function(ElementModel){
 return async function (req,res){
   let {id}=req.body;
    try{
        // await ElementModel.findByIdAndUpdate({_id:id}.req.body);
        let element=await ElementModel.findOne({_id:id});
        if(element){
            delete req.body.id
            for(let key in req.body){
                element[key]=req.body[key];
            }
            await element.save();
            res.status(200).json({element});
            
        }else{
            res.status(404).json({
                message:"element not found"
            })
        }
    }catch(err){
        res.status(200).json({
            message:err.message
        })
    }
}
}

module.exports.getElementById=function(ElementModel){
  return async function (req,res){
    try{
        let id=req.params.id;
        let element=await ElementModel.getElementById(id);
        res.status(200).json({
            element:element
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server error1"
        })
    }
   }
}