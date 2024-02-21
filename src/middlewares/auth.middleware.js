import jwt from 'jsonwebtoken'
import user from"../../db/models/user.model.js"

import {config} from"dotenv"
config({path:"../config/dev.config.env"})


const authMiddleWare=(accessRole)=>{
return async(req,res,next)=>{
  const{accesstoken}=req.headers
  if(!accesstoken) return next(new Error("token not accessed",{cause:400}))
   if(!accesstoken.startsWith(process.env.TOKEN_PREFIX)) return next(new Error("invalid token",{cause:400}))
const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
if(!token) return next(new Error("sth went wrong",{cause:"400"}))
const decodeToken= jwt.verify(token,process.env.JWT_SECRET_LOGIN)
if(!decodeToken|| !decodeToken.id)return next(new Error("data not found",{cause:400}))
  const findUser=await user.findById(decodeToken.id,'username email role')
if(!findUser)return next(new Error("user not found",{cause:404}))
if(!accessRole.includes(findUser.role))return next(new Error('unauthorized', { cause: 401 }))
req.authUser=findUser

next()

}
}
export default authMiddleWare