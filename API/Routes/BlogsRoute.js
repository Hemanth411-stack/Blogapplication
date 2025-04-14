import express from 'express';
import { createBlog, deleteBlog, getBlogById, getBlogs, getMyPublishedBlogs, updateBlog } from "../controllers/Blogcontroller.js"
import { protect } from '../middleware/authMiddleware.js';
// import { protect } from '../middleware/authMiddleware.js';
import multer from "multer"
const router = express.Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Max 6 files

router.post("/createblog",protect,upload.single('coverImage'),createBlog);
router.get("/getblogs",getBlogs);
router.get("/getblogbyid/:id",getBlogById)
router.get("/getmypublishedblogs",protect,getMyPublishedBlogs);
router.put("/updateblog/:id",protect,upload.single('coverImage'),updateBlog);
router.delete("/deleteblog/:id",protect,deleteBlog);
export default router