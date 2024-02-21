import bcrypt from"bcrypt"
import  Jwt from "jsonwebtoken"
import userModel from "../../../db/models/user.model.js"
import sendEmailService from "../services/send-emails.service.js"

export const signUp=async(req,res,next)=>{
    //1destruct database from the req.body
    const{
        username,
        email,
        password,
        age,
        role,
        phoneNumbers,
        addresses,
    
    }=req.body
    //2 check if the email is duplicate

    const isEmailDuplicate=await userModel.findOne({email})
    if(isEmailDuplicate)return next(new Error("email is already exist ",{cause:409}))
const userToken=Jwt.sign({email},process.env.JWT_SECRET_VERIFICATION,{expiresIn:'2m'})
    //3 send the email
   const isEmailSend= await sendEmailService({
        to:email,
        subject:"Email verification",
        message:`<h2>"please click on the link down below "</h2>
            <a href="http://localhost:3000/auth/verify-email?token=${userToken}"> verify email </a>`
        

    })
if(!isEmailSend)return next(new Error("Email is not sent, please try again later ",{cause:500}))
//hashpass'
const hashpassword=bcrypt.hashSync(password,+process.env.SALT_ROUND)
//create user 
const createUser={
    username,
        email,
        password:hashpassword,
        age,
        role,
        phoneNumbers,
        addresses,
}
const user =await userModel.create(createUser)
return res.status(201).json({msg:"user created successfully",user})

}

///////////////verify email///////////////////////////
/**
 * 1 destrust the token from req.query'
 * check the user if isverifired falsae
 * 
 * updated 
 * return the response 
 */
export const verifyEmail=async(req,res,next)=>{
    const {token}=req.query
    const decodeData=Jwt.verify(token,process.env.JWT_SECRET_VERIFICATION)
    const user=await userModel.findOneAndUpdate({email:decodeData.email,isEmailVerified:false},{isEmailVerified:true},{new:true})
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    res.status(200).json({
        success: true,
        message: 'Email verified successfully, please try to login'
    })
}


///////////////loginIN////

/**
 * 1 -destruct required data from req.body
 * 2 -check if email exist 
 * 3 -retrun done or invalid login credential 
 * 4 -check on the passwrod 
 * 5- return if credentials notvalid
 * 6 - genereate token sign ({},signature,{excepireIn})
 * 7-updated isLoggedIn = true  in database and save 
 * 8-return token
 */
export const signIn=async(req,res,next)=>{
    const{email ,password}=req.body
    //check if email exist =ture
    const isEmailExist=await userModel.findOne({email,isEmailVerified:true})
    if(!isEmailExist)return next(new Error("please signUp first ",{cause:404}))
    //check the password
const isMatchedPass=bcrypt.compareSync(password,isEmailExist.password)
if(!isMatchedPass)return next(new Error("not valid password",{cause:404}))
//generate token
const userToken=Jwt.sign({email,id:isEmailExist._id,isLoggedIn:true},process.env.JWT_SECRET_LOGIN,{expiresIn:"1h"})
isEmailExist.isLoggedIn=true
await isEmailExist.save()

return res.status(200).json({msg:"user logedIn successfully",token:userToken})

}


////////////update pass////////
export const updatePassword=async(req,res,next)=>{
    //check if the user exist  user must be logged in
    const {_id}=req.authUser 
    //destruct the data from the body
const{oldPassword,newPassword}=req.body
const isUserExist=await userModel.findById(_id)
if(!isUserExist) return next(new Error("user not found",{cause:404}))
//check old password
const isMatchedPass= bcrypt.compareSync(oldPassword,isUserExist.password)
if(!isMatchedPass) return next(new Error("please enter a valid password",{cause:404}))
//hasing the new pass
const hashedPassword= bcrypt.hashSync(newPassword,+process.env.SALT_ROUND)
isUserExist.password=hashedPassword
await isUserExist.save()
return res.status(200).json({message:"password updated successfully",success:true,isUserExist})

}

