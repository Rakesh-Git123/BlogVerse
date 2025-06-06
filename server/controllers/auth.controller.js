import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"

export const signup=async(req,res)=>{

  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ success:false,message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success:false,message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ success:false,message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({success:true,message:"Signup up successfully"})
}
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success:false,message: "Internal Server Error" });
      }
}

export const login=async(req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(400).json({ success:false,message: "Invalid credentials" });
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({ success:false,message: "Invalid credentials" });
        }

        const token = jwt.sign({userId:user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // MS
          secure: true,
          httpOnly: true, // prevent XSS attacks cross-site scripting attacks
          sameSite: "none", // CSRF attacks cross-site request forgery attacks
          expires: new Date(0)
        });
        
        res.status(200).json({success:true,message:"Logged in successfully",user});
      } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success:false,message: "Internal Server Error" });
      }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const{bio}=req.body;
    const userId = req.user._id;
    const user=await User.findById(userId);


    let updatedImage = user.image; 

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path);
            updatedImage = uploadResponse.secure_url;

        }
    await User.findByIdAndUpdate(
      userId,
      { 
        bio: bio || user.bio,
        profilePic: updatedImage }, 
      { new: true }
    );

    res.status(200).json({message:"Upated successfully"});
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    const { _id, email, fullName, profilePic } = req.user;
    res.status(200).json({ success: true, user: { _id, email, fullName, profilePic } });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ success:false,message: "Internal Server Error" });
  }
};