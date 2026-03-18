import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
},
    category: {
        type: String,
        required: true,
        default: "science",
        enum: ['science', 'nature', 'action']
    },
    url:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"This is a default description"
    },user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "credentials",
        required: true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"credentials",
        unique:true
    }]
}, {
    timestamps: true
})

const post_model = mongoose.model("post", postSchema)
export default post_model