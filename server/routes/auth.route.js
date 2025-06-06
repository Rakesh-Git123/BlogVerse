import express from "express";
import multer from "multer"
import { checkAuth, login, logout, signup, updateProfile, userProfile } from "../controllers/auth.controller.js";
import authenticate from "../middleware/authenticate.js";
const router=express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });


router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/profile/:id",userProfile);
router.put("/update-profile",authenticate,upload.single("profilePic"),updateProfile);
router.get("/check", authenticate, checkAuth);

export default router;