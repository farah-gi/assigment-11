import slugify from "slugify";
import categoryModel from"../../../db/models/category.model.js";
import generateUniqueString from "../../utils/generateuniquestring.js";
import cloudinaryConnection from "../../utils/cloudinaryconnection.js";
import subCategoryModel from "../../../db/models/sub-category.model.js";
import brandsModel from "../../../db/models/brands.model.js";
export const addCategory=async(req,res,next)=>{
    //1-destruct data from body
    const{name}=req.body
    const{_id}=req.authUser
    //check name 
const isNameExist=await categoryModel.findOne({name})
if(isNameExist)return next(new Error("name is already exist",{cause:409}))
//3 generate slug
const slug=slugify(name,"-")
//4 upload the image
if(!req.file)return next(new Error("no file uploaded",{cause:400}))
const folderId=generateUniqueString(6)
const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`${process.env.MAIN_FOLDER}/categories/${folderId}`
})
const category={
    name,
    slug,
    Image:{secure_url,public_id},
    folderId,
    addedBy:_id

}
//create cattegory
const createCategory=await categoryModel.create(category)
return res.status(200).json({message:"create category successfully",createCategory})

}
////////updateCategory/////
///////// getallcategory with their subcategory with populate///
export const updateCategory=async(req,res,next)=>{
//destruct from data from the req,body
const{name,oldPublicId}=req.body
//destrucy category from params
const {categoryId}=req.params
//destruct auther from the req.authUser
const{_id}=req.authUser
//check if the category found
const isCategoryFound=await categoryModel.findById(categoryId)
if(!isCategoryFound)return  next(new Error ("category not found",{cause:404}))
//check if the name is not duplicated is the same in the data bas
if(name==isCategoryFound.name)return next(new Error("please enter a diff category name",{cause:409}))
const isnameDuplicated=await categoryModel.findOne({name})
if(isnameDuplicated)return  next(new Error("please enter a diff category name",{cause:409}))
isCategoryFound.name=name
isCategoryFound.slug=slugify(name,"_")


//if the are a image to upadte
 const newPublicId=oldPublicId.split(`${isCategoryFound.folderId}/`)[1]
if(oldPublicId){
 if(!req.file) return next(new Error("please send an image to be uploaded",{cause:400}))
    const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/categories/${isCategoryFound.folderId}`,
        public_id:newPublicId
    })
    isCategoryFound.Image.secure_url=secure_url

}
isCategoryFound.updatedBy=_id

await isCategoryFound.save()
   return res.status(200).json({ success: true, message: 'Category updated successfully', data: isCategoryFound})
   

}
/////////////getcategory with their subcategory////
export const getAllCategories=async(req,res,next)=>{
    const categories=await categoryModel.find().populate([{
        path:"subcategories",
        populate:[{
            path:"brands"
        }]
    }])

    return res.status(200).json({message:"get all categories ",data:categories})
}
///////deleted category///
export const deletedCategory=async(req,res,next)=>{
    const {categoryId}=req.params
    //delete category with their childerens
    const categoryFound=await categoryModel.findByIdAndDelete(categoryId)
    if(!categoryFound)return next(new Error("category not found",{cause:404}))
    //delete their relatives sub_categories
const subcategories=await subCategoryModel.deleteMany(categoryId)
if(subcategories.deletedCount<=0){
    console.log(subcategories.deletedCount)
    console.log("their is no related subCategories found")

}
//delete brands related to this category
const Brands=await brandsModel.deleteMany(categoryId)
if(Brands.deletedCount<=0){
    console.log(Brands.deletedCount),
    console.log("their is no deleted brands")
}
//delete from cloudinary 
await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/categories/${categoryFound.folderId}`)
await cloudinaryConnection().delete_folder(`${process.env.MAIN_FOLDER}/categories/${categoryFound.folderId}`)
return res.status(200).json({msg:"delete category successfully"})
    

}