import Joi from "joi";

 export const signInSchema={

    body:Joi.object({
        email:Joi.string().required().email({tlds:{allow:['com','org','yahoo']}}),
        password:Joi.string().required()
    })
}