import Blog from "../models/blogModel.js";
import cloudinary from "../config/cloudinary.js"

// Create a new blog
export const createBlog = async (req, res) => {
    try{
    const { title, description, category } = req.body;
    const image = req.file.path;
    if (!image) {
        return res.status(400).json({ success:false,message: "Profile pic is required" });
      }
      const uploadResponse = await cloudinary.uploader.upload(image);
        const blog = await Blog.create({
            title,
            description,
            category,
            image:uploadResponse.secure_url,
            author: req.user.id
        });
        res.status(201).json({ success:true,message: "Blog added successfully" });
    } catch (err) {
        res.status(500).json({success:false, error: err.message });
    }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('author', 'fullName');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ success:false,error: "Error occurred" });
    }
};

export const getUserBlogs=async(req,res)=>{
    try{
        const blogs = await Blog.find({ author: req.params.id }).populate('author', 'fullName profilePic bio createdAt');
        res.json(blogs);
    }
    catch(err){
        res.status(500).json({ success:false,error: "Error occurred" });
    }
}

// Get a single blog by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'fullName')
            .populate('comments.author', 'fullName');
        if (!blog) return res.status(404).json({success:false, message: 'Blog not found' });
        res.json({ blog, user: req.user.id });
    } catch (err) {
        res.status(500).json({ success:false,error: err.message });
    }
};

// Update a blog
export const updateBlog = async (req, res) => {
    const { title, description } = req.body;
    
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success:false,message: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ success:false,message: 'User not authorized' });
        }

        let updatedImage = blog.image; 

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path);
            updatedImage = uploadResponse.secure_url;

        }

        const updatedBlog = {
            title: title || blog.title,
            description: description || blog.description,
            image: updatedImage,
        };

        await Blog.findByIdAndUpdate(req.params.id, { $set: updatedBlog }, { new: true });
        res.json({ success:true,message: "Blog updated successfully" });
    } catch (err) {
        res.status(500).json({ success:false,error: err.message });
    }
};


// Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success:true,message: "Blog successfully deleted" });
    } catch (err) {
        res.status(500).json({ success:false,error: err.message });
    }
};

// Add comment
export const addComment = async (req, res) => {
    const { text } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success:false,message: "Blog not found" });

        const comment = { text, author: req.user.id };
        blog.comments.push(comment);
        await blog.save();

        res.status(201).json({ success:true,message: "Comment added successfully" });
    } catch (err) {
        res.status(500).json({ success:false,error: err.message });
    }
};

// Update comment
export const updateComment = async (req, res) => {
    const { text } = req.body;
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ success:false,message: "Blog not found" });

        const comment = blog.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ success:false,message: "Comment not found" });

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({success:false, message: 'User not authorized' });
        }

        comment.text = text || comment.text;
        await blog.save();

        res.status(200).json({ success:true,message: "Comment updated successfully" });
    } catch (err) {
        res.status(500).json({success:false, message: err.message });
    }
};

// Delete comment
export const deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({success:false, message: "Blog not found" });

        const comment = blog.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ success:false,message: "Comment not found" });

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ success:false,message: 'User not authorized' });
        }

        blog.comments = blog.comments.filter(c => c._id.toString() !== req.params.commentId);
        await blog.save();

        res.status(200).json({ success:true,message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ success:false,error: err.message });
    }
};

// Like or unlike blog
export const toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const userId = req.user.id;

        if (!blog) return res.status(404).json({ success:false,message: "Blog not found" });

        const hasLiked = blog.likes.includes(userId);

        if (hasLiked) {
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        res.json({ liked:hasLiked?false:true, likes: blog.likes.length });
    } catch (err) {
        res.status(500).json({ success:false,message: err.message });
    }
};

export const getLikeStatus = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const userId = req.user.id;

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const hasLiked = blog.likes.includes(userId);
        res.json({ likes: blog.likes.length, liked: hasLiked });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

