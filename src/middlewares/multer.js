import multer from"multer"
import fs from"fs"
import path from "path"
import generateUniqueString from"../utils/generateuniquestring.js"
import { allowedExtensions } from "../utils/allowedextension.js"
 export const multerMiddleLocal=({
    extensions=allowedExtensions.image,
    filePath='general'
})=>{
    const destinationPath=path.resolve(`src/uploads/${filePath}`)//return the path
    if(!fs.existsSync(destinationPath)){
        fs.mkdirSync(destinationPath)}

    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
         cb(null,destinationPath)},

        filename:(req,file,cb)=>{
            const uniqueFileName=generateUniqueString(5)+"_"+file.originalname
            cb(null,uniqueFileName)}})

            const fileFilter=(req,file,cb)=>{
                if(extensions.includes(file.mimetype.split("/")[1])){
                    return cb(null,true)
                }
                cb(new Error("file extensions not supported"),false)
            }
            const file=multer({fileFilter,storage})
            return file
}
 export const multerMiddleHost=({
   extensions=allowedExtensions.image
})=>{
    const storage=multer.diskStorage({
        filename:(req,file,cb)=>{
            const uniqueFileName=generateUniqueString(5)+"_"+ file.originalname
            cb(null,uniqueFileName)
        }
    })

    //file filter
    const fileFilter=(req,file,cb)=>{
if(extensions.includes(file.mimetype.split("/")[1])){
   return cb(null,true)
}
        cb(new Error("file format is not supported"),false)
    }
    const file=multer({fileFilter,storage})
    return file
}
