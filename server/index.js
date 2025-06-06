import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import blogRoutes from "./routes/blog.route.js"
import cookieParser from "cookie-parser";
dotenv.config();
connectDB();

const app=express();
const PORT=process.env.PORT || 5000

app.use(cors({ origin: ["http://localhost:5173", "https://blogverseblogs.netlify.app/login"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/blog",blogRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})