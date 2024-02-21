import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { endPointesRoles } from "./brands.endpointesRole.js";
import authMiddleWare from'../../middlewares/auth.middleware.js'
import { multerMiddleHost } from "../../middlewares/multer.js";
import * as brandController from"./brands.controller.js"
import { allowedExtensions } from "../../utils/allowedextension.js";
const router=Router()

router.post("/addBrand",authMiddleWare(endPointesRoles.Add_Brands),
multerMiddleHost({ extensions: allowedExtensions.image}).single("image")
,expressAsyncHandler(brandController.addBrands))
export default router

router.put("/updateBrand:brandId",authMiddleWare(endPointesRoles.Add_Brands),multerMiddleHost({extensions:image}),expressAsyncHandler(brandController.updateBrand))

router.delete("/deletedBrand:brandId",authMiddleWare(endPointesRoles.Add_Brands),expressAsyncHandler(brandController.deleteBrand))