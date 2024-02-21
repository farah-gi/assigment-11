
import mongoose, {model,Schema}from"mongoose"
const productSchema=new Schema({
    title:{type:String,required:true},
    desc:String,
    slug:{type:String,required:true},
    folderId:{type:String,required:true,unique:true},
    /////numbers//
    basePrice:{type:Number,required:true},
    discount:{type:Number,default:0},
 appliedPrice :{type:Number,required:true},
    stock:{type:Number,min:1},
    rate:{type:Number,default:0,min:0,max:5},
    ////////Images///
    Images:[{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true,unique:true}
    }],
    ///////////specification///
    specs:{type:Map,of:[String||Number]},

    //////objects id///////////
    addedBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
    updatedBy:{type:Schema.Types.ObjectId,ref:'User'},
    categoryId:{type:Schema.Types.ObjectId,ref:"Category",required:true},
    subCategoryId:{type:Schema.Types.ObjectId,ref:"SubCategory",required:true},
    brandId:{type:Schema.Types.ObjectId,ref:"Brand",required:true}
},{timestamps:true})
export default mongoose.models.Product||model("Product",productSchema)