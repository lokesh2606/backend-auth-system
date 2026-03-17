import mongoose from "mongoose"
const db_schema= new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    feedPost:[{
        url:{type:String,required:true},
        title:{type:String,required:true},
        description:{type:String}, 
        category:{type:String,required:true,enum:["science","action","nature"]}
    }]
})

const db_model=mongoose.model("credentials",db_schema)
export default db_model