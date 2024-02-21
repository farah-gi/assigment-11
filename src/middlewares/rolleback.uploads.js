import cloudinaryConnection from "../utils/cloudinaryconnection.js"

export const roleBackUploads=async(req,res,next)=>{
if(req.folder){
    await cloudinaryConnection.api.delete_resources_by_prefix(req.folder)
    await cloudinaryConnection.api.delete_folder(req.folder)
}
next()
}