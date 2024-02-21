//validation on headers and on id
import Joi from "joi";
import { Types } from "mongoose";
const objectIdValidation=(value,helper)=>{
    const isValid=Types.ObjectId.isValid(value)
    return(isValid? true:helper.message("id not valid"))
}
const generalRules={
    dbId:Joi.string().required().custom(objectIdValidation),
    headersRules:Joi.object({
        accesstoken: Joi.string().required(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        'user-agent': Joi.string().required(),
        host: Joi.string().required(),                                     
        'accept-encoding': Joi.string(),
        'postman-token': Joi.string(),
        accept: Joi.string(),
        connection: Joi.string(),
        'cache-control': Joi.string(),
    })
    

}
export default generalRules