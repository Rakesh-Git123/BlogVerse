import mongoose from "mongoose";
import User from "../models/userModel.js";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category:{type:String,required:true},
    image: { type: String ,required:true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    comments: [commentSchema], //Array of comments
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
    date:{type:Date, default:Date.now}
})
// When you define a field in your Mongoose schema with type: mongoose.Schema.Types.ObjectId and ref: 'ModelName', it allows you to use the populate() method on that field. This enables you to fetch the referenced document(s) from another collection in MongoDB and include them in your query results.
const Blog=mongoose.model('blog',blogSchema)
export default Blog;