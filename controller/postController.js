import post_model from "../models/postModel.js"

//POST PICTURE
export const postPicture = async (req, res) => {
    const { url, title, description, category } = req.body
    if (!url || !title || !category) {
        return res.json({ message: "Missing Fields" })
    }
    if (category.toLowerCase() !== "science" && category.toLowerCase() !== "nature" && category.toLowerCase() !== "action") {
        return res.json({ message: "Invalid Category" })
    }
    const new_post = new post_model({
        url, title, description, category, user: req.user.id
    })
    new_post.save()
    res.json({ message: "post succesfully added", post: new_post })
}

// GET PICTURES
export const getPictures = async (req, res) => {
    const pictures = await post_model.find({ user: req.user.id })
    // console.log(pictures)
    if (pictures.length === 0) {
        return res.json({ message: "No Posts available" })
    }
    return res.json({
        message: "Retrieval successfull",
        posts: pictures
    })
}

// GET SINGLE PICTURE
export const getSinglePicture = async (req, res) => {
    try {
        const id = req.params.id

        // Find post by ID
        const pic = await post_model.findById(id)

        // Check if post exists
        if (!pic) {
            return res.json({ message: "Post not found" })
        }

        // Authorization check (important)
        if (pic.user.toString() !== req.user.id) {
            return res.json({ message: "Not authorized to view this post" })
        }

        // Return post
        return res.json({
            message: "Post fetched successfully",
            post: pic
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error })
    }
}


// UPDATE PICTURE
export const updatePicture = async (req, res) => {
    try {
        const { url, title, description, category } = req.body
        const id = req.params.id

        const pic = await post_model.findById(id)

        if (!pic) {
            return res.json({ message: "Invalid Id" })
        }

        if (pic.user.toString() !== req.user.id) {
            return res.json({ message: "No access to update this post" })
        }

        const updateFields = {}

        if (url) updateFields.url = url
        if (title) updateFields.title = title
        if (description) updateFields.description = description

        if (category) {
            const validCategories = ["science", "nature", "action"]

            if (!validCategories.includes(category.toLowerCase())) {
                return res.json({ message: "Invalid category" })
            }

            updateFields.category = category.toLowerCase()
        }

        // 🔴 IMPORTANT FIX
        if (Object.keys(updateFields).length === 0) {
            return res.json({ message: "No fields provided to update" })
        }

        const updatedPost = await post_model.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        )

        return res.json({
            message: "Post updated successfully",
            post: updatedPost
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}
// DELETE PICTURE
export const deletePost = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const temp = await post_model.findById(id)
        console.log(temp)
        console.log(temp.user, req.user.id)

        if (!temp) {
            return res.json({ message: "Invalid id" })
        }

        if (temp.user.toString() !== req.user.id) {
            return res.json({ message: "Not Authorized to delete this post" })
        }
        const deleted_post = await post_model.findByIdAndDelete(id)
        return res.json({ message: "Post Successfully Deleted", post: deleted_post })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error })

    }

}

//Like Picture
export const likePicture = async (req, res) => {
    try {
        const id = req.params.id

        const picture = await post_model.findById(id)

        if (!picture) {
            return res.status(404).json({ message: "Invalid Id" })
        }

        // Prevent liking own post
        if (picture.user.toString() === req.user.id) {
            return res.status(403).json({ message: "Cannot like your own picture" })
        }

        // Atomic update (IMPORTANT)
        const updatedPost = await post_model.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        )

        return res.json({
            message: "Picture successfully liked",
            post: updatedPost
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}