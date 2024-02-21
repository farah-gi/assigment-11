import { populate } from "dotenv"
import brandsModel from "../../../db/models/brands.model.js"
import subCategoryModel from "../../../db/models/sub-category.model.js"
import slugify from "slugify"
import generateUniqueString from "../../utils/generateuniquestring.js"
import cloudinaryConnection from "../../utils/cloudinaryconnection.js"

//add brands///
export const addBrands=async(req,res,next)=>{
//destruct the data from the req.body
const{name}=req.body
//destruct category and subcategory related to this brand
const{categoryId,subCategoryId}=req.query
//destruct the user who is logged in 
const addedBy=req.authUser._id
//check on the subcategory
const subCategoryFound=await subCategoryModel.findById(subCategoryId).populate('categoryId','folderId')
if(!subCategoryFound)return next(new Error("subCategory not found",{cause:404}))
//check on the brands duplication
const brandAlreadyExist=await brandsModel.findOne({name,subCategoryId})
if(brandAlreadyExist)return next(new Error("brand already exist",{cause:400}))

//check on the category 
if(categoryId!=subCategoryFound.categoryId._id)return next(new Error("category not found",{cause:400}))
//generate the slug
const slug=slugify(name,"_")
if(!req.file)return next(new Error("please enter a file to be uploaded"))
const folderId=generateUniqueString(5)
const folderPath=`${process.env.MAIN_FOLDER}/categories/${subCategoryFound.categoryId.folderId}/subCategory/${subCategoryFound.folderId}/brands/${folderId}`
const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:folderPath
})
req.folder=folderPath
const brandObject={
    name,
    slug,
    folderId,
    Image:{secure_url,public_id},
    addedBy:_id,
    subCategoryId,
    categoryId
}
const brandCreated=await brandsModel.create(brandObject)
return res.status(200).json({msg:"brand created successfully",
data:brandCreated})

}
//////update brand////////
export const updateBrand=async(req,res,next)=>{
    const{name,oldPublicId}=req.body
    const {brandId}=req.params
    const{addedBy}=req.authUser._id
    console.log(addedBy)
    //check if their is brand
    const brandFound=await brandsModel.findById(brandId)
    if(!brandFound)return next(new Error("couldn't find brand",{cause:400}))
    if(name==brandFound.name)return next(new Error("please enter a new name",{cause:400}))
brandFound.name=name
brandFound.slug=slugify(name,"_")
const newPublicId=oldPublicId.split(`${brandFound.folderId}`)[1]
const folderPath=oldPublicId.split(`${brandFound.folderId}`)[0]
if(oldPublicId){
    if(!req.file)return next(new Error("file not found ",{cause:404}))
    const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
folder:folderPath +`${brandFound.folderId}`,
public_id:newPublicId})
brandFound.Image.secure_url=secure_url
}
await brandFound.save()
return res.status(200).json({msg:"updated successfully",brandFound})

}
///////////////deleted brands.....///
export const deletedBrand=async(req,res,next)=>{
    const{brandId}=req.params
    const {addedBy}=req.authUser._id
const deletedBrand=await brandsModel.findByIdAndDelete(brandId)

const folderPath=deletedBrand.Image.public_id.split(`${deletedBrand.folderId}`)[0]
//delete from cloudinary
await cloudinaryConnection().api.delete_resources_by_prefix(`${folderPath}+${deletedBrand.folderId}`)
await cloudinaryConnection().delete_folder(`${folderPath}+${deletedBrand.folderId}`)
return res.status(200).json({msg:"deleted successfully"})

}
/////get all brands///////
export const getAllBrands=async(req,res,next)=>{
     const brands=await brandsModel.find().populate([{
        path:"subcategoryId"
    },{
        path:"categoryId"
    }])
    return res.status(200).json({msg:"get all brands",data:brands})
}
