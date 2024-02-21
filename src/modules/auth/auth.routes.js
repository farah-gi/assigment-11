import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as authController from"./auth.controller.js"
import endPointes from "./endpointes.js";
import authMiddleWare from "../../middlewares/auth.middleware.js";

const router=Router()
router.post("/signup",expressAsyncHandler(authController.signUp))
router.get('/verify-email',expressAsyncHandler(authController.verifyEmail))
router.post("/signIn",expressAsyncHandler(authController.signIn))
router.put("/updatedPass",authMiddleWare(endPointes.updatedPass),expressAsyncHandler(authController.updatePassword))
export default router