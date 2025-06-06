// routes/blogRoutes.js
import express from 'express';
// import upload from '../middleware/upload.js';
import authentication from '../middleware/authenticate.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  addComment,
  updateComment,
  deleteComment,
  toggleLike,
  getLikeStatus
} from '../controllers/blog.controller.js';

import multer from 'multer'
const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/', authentication, upload.single('image'), createBlog);
router.get('/',getAllBlogs);
router.get('/user/:id',authentication,getUserBlogs);
router.get('/:id', authentication, getBlogById);
router.put('/:id', authentication, upload.single('image'), updateBlog);
router.delete('/:id', authentication, deleteBlog);

// Comments
router.post('/:id/comments', authentication, addComment);
router.put('/:blogId/comments/:commentId', authentication, updateComment);
router.delete('/:blogId/comments/:commentId', authentication, deleteComment);

// Likes
router.post('/like/:id', authentication, toggleLike);
router.get('/like/:id', authentication, getLikeStatus);

export default router;
