import cloudinaryConnection from "../utils/cloudinaryconnection.js";
export const roleBackSavedDocuments=async(req,res,next)=>{
    if(req.savedDocuments){
        const {model,_id}=req.savedDocuments
        await model.findByIdAndDelete(_id)
    }
}