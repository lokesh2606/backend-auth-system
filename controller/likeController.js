import post_model from "../models/postModel.js"
import { getPictures } from "./postController.js"


//Like Picture
export const likePicture = async (req, res) => {
    try {
        const id = req.params.id

        const picture = await post_model.findById(id)

        if (!picture) {
            return res.status(404).json({ message: "Invalid Id" })
        }

        // Prevent liking own post
        // console.log(picture.user,req.user.id)
        if (picture.user.toString() === req.user.id) {
            return res.status(403).json({ message: "Cannot like your own picture" })
        }

        // Prevent liking one post multiple times
        if(picture.likes.includes(req.user.id)){
            return res.json({message:"Cannot like a post multiple times"})
        }

        // // Atomic update (IMPORTANT)
        // const updatedPost = await post_model.findByIdAndUpdate(
        //     id,
        //     { $inc: { likes: 1 } },
        //     { new: true }
        // )
        const liked_picture= await post_model.findByIdAndUpdate(id,
            {$push:{likes:req.user.id}}
        )
        return res.json({
            message: "Picture successfully liked",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

// UNLIKE A POST
export const unlikePicture=async(req,res)=>{
    try {
        const id=req.params.id
        const picture=await post_model.findById(id)
        if(!picture){
            return res.json({message:"invalid id"})
        }
        if(req.user.id===picture.user.toString()){
            return res.json({message: "cannot unlike your own post"})
        }
        if(!picture.likes.includes(req.user.id)){
            return res.json({message:"picture is not liked. Cannot unlike it"})
        }
        let index;
        for(let i in picture.likes){
            if(picture.likes[i]===req.user.id){
                index=i;
                break;
            }
        }
        picture.likes.splice(index,1)
        await picture.save()
        return res.json({message:"Picture Un-liked"})
    } catch (error) {
        return res.json({message:"Server Error",error:error.message})
    }
}

// GET LIKES OF A POST
export const likesOfPicture= async(req,res)=>{
    try {
        const id=req.params.id
        const picture= await post_model.findById(id)
        if(!picture){
            return res.json({message:"Invalid Picture"})
        }
        if(req.user.id!==picture.user.toString()){
            return res.json({message:"No access to view the likes of this picture"})
        }
        await picture.populate("likes","email")
        return res.json({message:"The users who liked this post are:",
            likes:picture.likes
        })
    } catch (error) {
        return res.json({message:"Server error",error:error.message})
    }
}