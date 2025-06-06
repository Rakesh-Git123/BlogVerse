import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: "https://staging.svgrepo.com/show/295402/user-profile.svg"
  },
  bio:{
    type:String,
    default:"No bio yet"
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true 
});

const User = mongoose.model("User", userSchema);
export default User;
