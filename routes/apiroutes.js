import express from "express"
import { login,signup } from "../controller/appController.js"
import { verifyToken } from "../middleware/appmiddleware.js"
import { deletePost, getPictures, getSinglePicture, postPicture, updatePicture } from "../controller/postController.js"
import { likePicture, likesOfPicture, unlikePicture } from "../controller/likeController.js"

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/viewpicture",verifyToken,postPicture)
router.get("/viewpicture",verifyToken,getPictures)
router.get("/viewpicture/:id", verifyToken, getSinglePicture)
router.patch("/viewpicture/:id",verifyToken, updatePicture )
router.delete("/viewpicture/:id",verifyToken,deletePost)
router.patch("/likepicture/:id",verifyToken,likePicture)
router.patch("/unlikepicture/:id",verifyToken,unlikePicture)
router.get("/likes/:id",verifyToken,likesOfPicture)

export default router