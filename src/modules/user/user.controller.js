import userModel from "../../../db/models/user.model.js";
export const updateProfileUser=async(req,res,next)=>{
//destruct data from the body 
const{email,phoneNumbers}=req.body
const{_id}=req.authUser
//check if the user found
const userFound=await userModel.findById(_id)
if(!userFound)return next(new Error("user not found",{cause:404}))

//check if email already exist 
if(email){
    const isEmailExist=await userModel.findOne({email})
    if(isEmailExist)return next(new Error("please enter a diff email",{cause:400}))
     userFound.email=email
}

//check the phone number 
if(phoneNumbers){
    const isMobileNumExist=await userModel.findOne({phoneNumbers})
    if(isMobileNumExist)return next(new Error("please enter a diff mobile num",{cause:400}))
    userFound.phoneNumbers=phoneNumbers
}

await userFound.save()
return res.status(200).json({msg:"user profile updated successfully",data:userFound})


}
/////delete user profile
export const deleteUser=async(req,res,next)=>{
//destruct the user
const {_id}=req.authUser
//check if the user is found
const userFound= await userModel.findById(_id)
     if(!userFound)return next(new Error("user not found",{cause:404}))
     const deleteUser=await userModel.findByIdAndDelete({_id})
 return res.status(200).json({msg:"deleted successfully",deleteUser})

}

//get user profile
export const getProfileUser=async(req,res,next)=>{
    //destruct user id
    const {_id}=req.authUser
    //check if the user found
    const userFound=await userModel.findById(_id)
    if(!userFound)return next(new Error("user not found",{cause:404}))
    return res.status(200).json({msg:"user data ",data:userFound})
}