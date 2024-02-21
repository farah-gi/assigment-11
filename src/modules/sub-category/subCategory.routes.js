import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as subCategoryController from "./subCategory.controller.js"
import authMiddleWare from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedextension.js";
import { endPointesRole } from "./endpointesRoles.js";


const router=Router()
router.post("/addSubCategory:categoryId",authMiddleWare(endPointesRole.addSubCat),multerMiddleHost({extensions:allowedExtensions.image}).single("image"),expressAsyncHandler(subCategoryController.addSubCategory))


router.put("/updateSubCategory:subCategoryId",authMiddleWare(endPointesRole.addSubCat),multerMiddleHost({extensions:allowedExtensions.image}).single("image"),expressAsyncHandler(subCategoryController.updateSubCategory))

router.delete("/deletedSubCategory:subCategoryId",authMiddleWare(endPointesRole.addSubCat),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(subCategoryController.deletedSubCategory))


router.get("/getallSubCat",authMiddleWare(endPointesRole.addSubCat),expressAsyncHandler(subCategoryController.getallSubcategories))



export default router