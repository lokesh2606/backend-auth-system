import express from "express"
import { getPictures, login, postPicture, signup } from "../controller/appController.js"
import { verifyToken } from "../middleware/appmiddleware.js"

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/postpicture",verifyToken,postPicture)
router.get("/viewpicture",verifyToken,getPictures)

export default router