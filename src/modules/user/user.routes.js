import authMiddleWare from "../../middlewares/auth.middleware.js"
import { endPointesRole } from "./endpointesRole.js"
import *as userController from"./user.controller.js"
import expressAsyncHandler from "express-async-handler"
import { Router } from "express"
const router=Router()
router.put("/addProfileUser",authMiddleWare(endPointesRole.UpdateProfile),expressAsyncHandler(userController.updateProfileUser))


router.delete("/deletedUser",authMiddleWare(endPointesRole.UpdateProfile),
expressAsyncHandler(userController.deleteUser))
router.get("/getUserProfile",authMiddleWare(endPointesRole.UpdateProfile),expressAsyncHandler(userController.getProfileUser))
export default router