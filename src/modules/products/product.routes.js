import { Router } from "express";
import authMiddleWare from "../../middlewares/auth.middleware.js";
import endpointesRole from "./endPointes.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedextension.js";
import expressAsyncHandler from "express-async-handler";
import * as productController from"./product.controller.js"
import systemRoles from "../../utils/systemRoles.js";
const router=Router()
router.post("/addProduct",authMiddleWare(endpointesRole.addProduct),multerMiddleHost({
    extensions:allowedExtensions.image
}).array('image',3),expressAsyncHandler(productController.addProduct))
router.put("/updateProduct:productId",authMiddleWare(endpointesRole.addProduct),multerMiddleHost({extensions:allowedExtensions.image}).single("image"),
expressAsyncHandler(productController.updateProduct))
export default router