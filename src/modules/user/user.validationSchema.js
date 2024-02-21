import Joi from"joi"
import { Schema,Types} from "mongoose"
const ageRule=(value,helper)=>{
    if(value==4){
        return helper.message("age must be greater then four ")
    }
    return value
}
 export const singUpSchema=({
    body:Joi.object({
username:Joi.string().required(),
email:Joi.string().required().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments:1 }),
password:Joi.string().required(),
phoneNumbers: Joi.string().required(),
addresses:Joi.string().required(),
gender:Joi.string().valid(["female","male"]),
age:Joi.number().custom(ageRule)
    })
    .with("email","password")
})