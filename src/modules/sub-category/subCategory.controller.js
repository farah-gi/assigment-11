import slugify from "slugify";
import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/sub-category.model.js";
import cloudinaryConnection from "../../utils/cloudinaryconnection.js";
import generateUniqueString from "../../utils/generateuniquestring.js";
import { brandRouter } from "../index.routes.js";
import brandsModel from "../../../db/models/brands.model.js";
export const addSubCategory = async (req, res, next) => {
    // 1- destructuring the request body
    const { name } = req.body
    const { categoryId } = req.params
    const { _id } = req.authUser

    // 2- check if the subcategory name is already exist
    const isNameDuplicated = await subCategoryModel.findOne({ name })
    if (isNameDuplicated) {
        return next({ cause: 409, message: 'SubCategory name is already exist' })
        // return next( new Error('Category name is already exist' , {cause:409}) )
    }

    // 3- check if the category is exist by using categoryId
    const category = await categoryModel.findById(categoryId)
    if (!category) return next({ cause: 404, message: 'Category not found' })

    // 4- generate the slug
    const slug = slugify(name, '-')

    // 5- upload image to cloudinary
    if (!req.file) return next({ cause: 400, message: 'Image is required' })

    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/categories/${category.folderId}/SubCategories/${folderId}`
    })


    // 6- generate the subCategory object
    const subCategory = {
        name,
        slug,
        Image: { secure_url, public_id },
        folderId,
        addedBy: _id,
        categoryId
    }
    // 7- create the subCategory
    const subCategoryCreated = await subCategoryModel.create(subCategory)
    res.status(201).json({ success: true, message: 'subCategory created successfully', data: subCategoryCreated })
}
/////update subCategory////

export const updateSubCategory=async(req,res,next)=>{
    //destruct the data
const{name,oldPublicId}=req.body
const {subCategoryId}=req.params
const {addedBy}=req.authUser._id
//check if the subcategory found
const subCategoryFound=await subCategoryModel.findById(subCategoryId)
if(!subCategoryFound)return next (new Error("subCategory not found",{cause:404}))
if(name==subCategoryFound.name)return next(new Error("please enter diff name",{cause:400}))
const nameDuplicate=await subCategoryModel.findOne({name})
if(nameDuplicate)return next(new Error("name already exist",{cause:400}))
subCategoryFound.name=name
subCategoryFound.slug=slugify(name,"_")
//check if oldpublicid
if(oldPublicId){
    if(!req.file)return next(new Error("file not found",{cause:404}))
    const newPublicId=oldPublicId.split(`${subCategoryFound.folderId}`)[1]
const folderPath=oldPublicId.split(`${subCategoryFound.folderId}`)[0]
const{secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:folderPath+`${subCategoryFound.folderId}`,
    public_id:newPublicId
})
subCategoryFound.Image.secure_url=secure_url
req.folder=folderPath+`${subCategoryFound.folderId}`
}
subCategoryFound.updatedBy=addedBy

await subCategoryFound.save()
return res.status(200).json({msg:"updated successfully",data:subCategoryFound})
    
}
/////delete subcategory//
export const deletedSubCategory=async(req,res,next)=>{
    const {subCategoryId}=req.params
    const{_id}=req.authUser
    //check if the subcategory found and deleted 
    const deletedSubCategory=await subCategoryModel.findByIdAndDelete({subCategoryId})
    if(!deletedSubCategory)return next(new Error("deleted failed",{cause:400})) 
    //delete their child
const brandsDeleted=await brandsModel.findManyAndDelete({subCategoryId})
if(brandsDeleted.deletedCount<=0){
    console.log("their is no related brands")
}

const folderPath=deletedSubCategory.Image.public_id.split(`${deletedSubCategory.folderId}`)[0]
//delete from cloudinary
await cloudinaryConnection().api.delete_resources_by_prefix(`${folderPath}+${deletedSubCategory.folderId}`)
await cloudinaryConnection().delete_folder(`${folderPath}+${deletedSubCategory.folderId}`)
return res.status(200).json({msg:"deleted subcategory successfully"})

}
//getallsubcategories with their brands
export const getallSubcategories=async(req,res,next)=>{
const subcategories=await subCategoryModel.find().populate([{
    path:"Brands"
}])
return res.status(200).json({msg:"all suubCategories with their brands",subcategories})
}