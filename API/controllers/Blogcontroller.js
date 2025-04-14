import Blog from '../models/Blog.js';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'blog_images',
        resource_type: 'auto'
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;
    let coverImageUrl = req.body.coverImage || Blog.schema.path('coverImage').defaultValue;

    // Upload new image if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      title,
      content,
      tags,
      status,
      coverImage: coverImageUrl,
      author: req.user.id
    });

    res.status(201).json({
      blog,
      message: `Blog created successfully by ${req.user.name}`
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Blog creation failed',
      error: error.message 
    });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'name email')
      .sort('-createdAt');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name email')
      .populate('comments.user', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyPublishedBlogs = async (req, res) => {
  try {
    // Get userId from middleware (req.user._id)
    const userId = req.user.id;
    console.log(`user details`,req.user)
    const blogs = await Blog.find({
      author: userId,
      status: 'published'
    })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You haven't published any blogs yet",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your published blogs',
      error: error.message
    });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get fields from form-data
    const { title, content, tags, status } = req.body;
    let coverImageUrl = blog.coverImage;

    // Handle file upload if provided
    if (req.file) {
      // Delete old image if it's not the default
      if (!blog.coverImage.includes('unsplash.com')) {
        const publicId = blog.coverImage.split('/').pop().split('.')[0];
        await cloudinary.v2.uploader.destroy(`blog_images/${publicId}`);
      }
      
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    // Parse tags if they come as a string
    const parsedTags = typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim())
      : tags;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags: parsedTags,
        status,
        coverImage: coverImageUrl
      },
      { new: true, runValidators: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      message: 'Blog update failed',
      error: error.message 
    });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Check if user is the author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this blog' 
      });
    }

    // Delete cover image from Cloudinary if not default
    if (blog.coverImage && !blog.coverImage.includes('default-image-url')) {
      const publicId = blog.coverImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`blog_images/${publicId}`);
    }

    await blog.deleteOne();

    res.status(200).json({ 
      success: true,
      message: 'Blog deleted successfully',
      data: { id: blog._id }
    });

  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete blog',
      error: error.message 
    });
  }
};


export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if already liked
    if (blog.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Blog already liked' });
    }

    blog.likes.push(req.user.id);
    await blog.save();

    res.json({ message: 'Blog liked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = {
      user: req.user.id,
      text
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};