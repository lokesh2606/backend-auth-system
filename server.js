import express from "express"
import dotenv from "dotenv"
import router from "./routes/apiroutes.js"
import connect_db from "./data/database.js"


const app=express()
connect_db()
app.use(express.json())
dotenv.config()

app.get("/",(req,res)=>{
    res.json({message:"Welcome To Login Page"})
})

app.use("/api",router)

app.use((req,res)=>{
    res.json({message:"Invalid URL try again"})
})


app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})