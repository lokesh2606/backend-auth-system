import jwt from "jsonwebtoken"

export const tokenManager = {
generateToken:(id)=>{
 const token= jwt.sign({id},process.env.jwt_secret_key,{expiresIn:"2h"})
 return token;
}
}