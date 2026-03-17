
import bcrypt from "bcrypt"
import db_model from "../models/loginmodel.js"
import jwt from "jsonwebtoken"


export const signup = (async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ message: "Email or Password is Missing" })
    }

    const hashed_pass = await bcrypt.hash(password, 10)
    if (!email.includes("@gmail.com")) {
        return res.json({ message: "Invalid Email. Try Again...." })
    }
    if (password.length < 8) {
        return res.json({ message: "Password is too short. Try Again..." })
    }
    const add_user = new db_model({
        email,
        password: hashed_pass
    })
    await add_user.save()
    const token= jwt.sign({email},process.env.jwt_secret_key,{expiresIn:"2h"})
    res.status(201).json({ message: "Signup Successfull" , token:token})
})

export const login = async (req, res) => {
    const { email, password } = req.body


    if (!email.includes("@gmail.com")) {
        return res.json({ message: "Invalid Email. Try Again." })
    }
    const user = await db_model.findOne({ email })
    if (!user) {
        return res.json({ message: "Account doesn't exist. Signup...." })
    }
    const pass_check = await bcrypt.compare(password, user.password)
    if (!pass_check) {
        return res.json({ message: "Wrong password." })
    }

    const token = jwt.sign({ email }, process.env.jwt_secret_key, {
        expiresIn: "1h",
       

    })
    console.log(token)
    return res.json({ message: "Login Successfull", token:token })
}

//jwt.sign(payload,secret,options)


export const postPicture=async(req,res)=>{
    const { url, title, description, category}= req.body
    if(!url || !title || !category){
        return res.json({message:"Missing Fields"})
    }
    if(category.toLowerCase()!=="science" && category.toLowerCase()!=="nature" && category.toLowerCase()!=="action"){
        return res.json({message:"Invalid Category"})
    }
    await db_model.updateOne(
  { email: req.user.email },
  { $push: { feedPost: { url, title, description, category } } }
);
    res.json({message:"post succesfully added"})
}


export const getPictures=async(req,res)=>{
    const pictures=await db_model.findOne({email:req.user.email})
    console.log(pictures)
    if(!pictures.feedPost){
        return res.json({message:"No Posts available"})
    }
    return res.json({message:"Retrieval successfull",
        posts:pictures.feedPost
    })
}