import slugify from "slugify"
import brandModel from"../../../db/models/brands.model.js"
import systemRoles from "../../utils/systemRoles.js"
import cloudinaryConnection from "../../utils/cloudinaryconnection.js"
import productModel from"../../../db/models/product.model.js"


export const addProduct=async(req,res,next)=>{
    //destruct the data from the req body
    const{title,desc,stock, basePrice ,discount,specs}=req.body
    //destruct the required related ids
    const {categoryId, subCategoryId,brandId}=req.query
    //destruct the user who is logged in 
    const addedBy=req.authUser._id
    ///brand check
    const brand=await brandModel.findById(brandId)
    if(!brand)return next(new Error ("brand not found ",{cause:404}))
    if(brand.categoryId.toString()!==categoryId)return next(new Error("category not match with this brand",{cause:400}))
    if(brand.subcategoryId.toString()!==subCategoryId)return next(new Error("subcategoryId not match with this brand ",{cause:400}))
    //check of the authorized user
if(req.authUser.role!==systemRoles.superAdmin&&
    brand.addedBy.toString()!==addedBy.toString()
    )return next(new Error("user not authoRized",{cause:400}))
    //generate the slug
    const slug=slugify(title,{lower:true,replacement:"-"}) 

    ///if their is an image
    if(!req.files?.length)return next(new Error("files is required",{cause:400}))
    let Images=[]
const folderPath=brand.Image.public_id.split(`${brand.folderId}/`)[0]
console.log(folderPath)
const folderId=generateUniqueString(5)
for(const product of req.files){
const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(product.path,{
    folder:folderPath + `${brand.folderId}/product/${folderId}`
       
    })
    Images.push({secure_url,public_id})

}
req.folder=folderPath + `${brand.folderId}/product/${folderId}`
//clac applied prise
const  appliedPrice=basePrice-(basePrice*(discount||0) / 100)
const productCreate={
    title,desc,stock, basePrice ,appliedPrice,discount,specs:JSON.parse(specs),addedBy
    ,
    categoryId, subCategoryId,brandId
}
const product=await productModel.create(productCreate)
req.saveDocuments={ model: productModel, _id: product._id }
return res.status(201).json({msg:"products created successfully",product})
    }
    /**
     *electronics>>mobiles>>iphone>>products
destination>>public_id

     */
    //////update product///
    export const updateProduct=async(req,res,next)=>{
        //destruct data from the body
        //productId
        //auth user
        const{title,stock,specs,basePrice,discount,desc,oldPublicId}=req.body
        const{productId}=req.params
        const addedBy=req.authUser._id
const productFound=await productModel.findById(productId)
if(!productFound)return next(new Error("product not found",{cause:404}))
if(req.authUser.role!==systemRoles.superAdmin&&
    addedBy.toString()!==productFound.addedBy.toString())return next(new Error("user not authorized",{cause:400}))

    //title
    if(title){
        productFound.title=title
        productFound.slug=slugify(title,{lower:true,replacement:'-'})
    }
    if(desc)productFound.desc=desc
    if(specs)productFound.specs=JSON.parse(specs)
    if(stock)productFound.stock=stock
const appliedPrice=(basePrice||productFound.basePrice)*(1-(discount||productFound.discount/100))
productFound.appliedPrice=appliedPrice
if(basePrice)productFound.basePrice=basePrice
if(discount)productFound.discount=discount

//image replace
const newPublicId=productFound.Images[0].public_id.split(`${productFound.folderId}/`)[1]
const folderPath=productFound.Images[0].public_id.split(`${productFound.folderId}/`)[0]
if(oldPublicId){
    if(!req.file)return next(new Error("product file needed"))
    const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
folder:folderPath +`${productFound.folderId}`,
public_id:newPublicId

    })
    req.folder=folderPath +`${productFound.folderId}`
}
//update in the data base
productFound.Images.map((product)=>{
    if(product.public_id==oldPublicId){
        product.secure_url=secure_url
    }
})
await productFound.save()

return res.status(200).json({message:"product updated successfully",productFound})
    }