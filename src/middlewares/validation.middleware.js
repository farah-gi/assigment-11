import mongoose from"mongoose"


const reqKeys=['query','params','body',"headers"]
export const validationMiddleWare=(schema)=>{
    return (req,res,next)=>{   
         const validationErrorArr=[]
         for(const key of reqKeys){
       validationResult=schema[key]?.validate(req[key],{abortEarly:false})
 if(validationResult.error){
    validationErrorArr.push(...validationResult.error.details)}
}
if(validationErrorArr?.length){
return  res.status(400).json({message:"validation Error",err_msg:validationErrorArr.map(ele=>ele.message)})
}
next()
    }
}