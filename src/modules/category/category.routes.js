import { Router } from "express"
import systemRoles from "../../utils/systemRoles.js"
import * as categoryController from "./category.controller.js"
import { endPointesRoles } from "./category.endpoints.js"
import expressAsyncHandler from "express-async-handler"
import authMiddleWare from "../../middlewares/auth.middleware.js"
import { multerMiddleHost } from "../../middlewares/multer.js"
import { allowedExtensions } from "../../utils/allowedextension.js"
const router=Router()
router.post("/addCategory",authMiddleWare(systemRoles.superAdmin),
multerMiddleHost({extensions:allowedExtensions.image}).single('image')
,expressAsyncHandler(categoryController.addCategory))

router.put("/updateCategory/categoryId",authMiddleWare(endPointesRoles.UpdateCategory),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categoryController.updateCategory))
router.delete("/deletedCategory:categoryId",authMiddleWare(endPointesRoles.Deleted_Categories),
multerMiddleHost({extensions:allowedExtensions.image}).single("image"),expressAsyncHandler(categoryController.deletedCategory))

router.get("/getAllCategories",expressAsyncHandler(categoryController.getAllCategories))
export default router