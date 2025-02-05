const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const authMiddleware = require('../middleware/auth');
const { sendNewBlogNotification } = require('../utils/emailService');

// Debug middleware for blog routes
router.use((req, res, next) => {
  console.log(`Blog Route accessed: ${req.method} ${req.url}`);
  next();
});

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Blog router is working' });
});

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single blog - Remove authMiddleware for public access
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching blog with ID:', id);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // For hardcoded blogs (numeric IDs)
      const hardcodedBlog = findHardcodedBlog(id);
      if (hardcodedBlog) {
        return res.json(hardcodedBlog);
      }
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(id).populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

// Helper function to find hardcoded blogs
const findHardcodedBlog = (id) => {
  const hardcodedBlogs = [
    {
      id: '1',
      title: "Mastering React Hooks",
      content: `React Hooks are a powerful feature that allows you to use state and other React features without writing a class component.
               They were introduced in React 16.8 and have changed how we write React components.
               
               Here's what you need to know about the most commonly used hooks:
               
               1. useState: Manages state in functional components
               2. useEffect: Handles side effects like data fetching
               3. useContext: Subscribes to React context
               4. useRef: Maintains mutable references`,
      excerpt: "Learn how to use React Hooks effectively to build dynamic applications...",
      image: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    // Add other hardcoded blogs here
  ];
  
  return hardcodedBlogs.find(blog => blog.id.toString() === id.toString());
};

// Create a new blog
router.post('/', authMiddleware, async (req, res) => {
    console.log('Blog Route accessed: POST /');
    try {
        const { title, content, image, excerpt } = req.body;
        const newBlog = new Blog({
            title,
            content,
            image,
            excerpt,
            author: req.user.id // Assuming req.user contains the authenticated user's info
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a blog
router.delete('/:id', authMiddleware, async (req, res) => {
    console.log(`Blog Route accessed: DELETE /${req.params.id}`);
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author && blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
