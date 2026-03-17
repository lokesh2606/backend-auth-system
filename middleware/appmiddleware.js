import jwt from "jsonwebtoken"

export const verifyToken=async(req,res,next)=>{
    const authHead=req.headers.authorization
    if(!authHead){
        return res.json({message:"Login/Sign in "})
    }
    const temp= authHead.split(" ")
    const token=temp[1]
    try{
        const authorized=jwt.verify(token,process.env.jwt_secret_key)
        if(!authorized){
            return res.json({message:"Invalid Token."})
        }
        req.user=authorized
        next()
    }
    catch(error){
        return res.json({error})
    }
}