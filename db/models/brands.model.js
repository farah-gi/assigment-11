import mongoose from"mongoose"
const brandsSchema= new mongoose.Schema({
name:{type:String,required:true,trim:true},
slug:{type:String,required:true,trim:true},
Image:{
    secure_url:{type:String,required:true},
    public_id:{type:String ,required:true,unique:true}
},
folderId:{type:String,required:true,unique:true},
addedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},
subcategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"SubCategory",required:true,unique:true},
categoryId:{type: mongoose.Schema.Types.ObjectId,ref:"Category",required:true,unique:true},

},{timestamps:true,
   
})

export default mongoose.model('Brands',brandsSchema)