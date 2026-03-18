import mongoose from "mongoose"
const db_schema= new mongoose.Schema({
    email:{type:String,required:true,unique:true,lowerCase:true},
    password:{type:String,required:true},
})

const login_model=mongoose.model("credentials",db_schema)
export default login_model