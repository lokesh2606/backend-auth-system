import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

async function connect_db(){
    try{
        await mongoose.connect(process.env.URI)
        console.log("DataBase is connected")
    } 
    catch(error){
        console.log("error in connecting to db",error)
    }
}

export default connect_db