import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateBlogPage from "./CreateBlogPage"; // Import the CreateBlogPage component

// Sample data for featured and recent blogs
const initialFeaturedBlogs = [
  {
    id: 1,
    title: "Mastering React Hooks",
    excerpt: "Learn how to use React Hooks effectively to build dynamic applications...",
    image: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Understanding Node.js Middleware",
    excerpt: "A deep dive into middleware functions and how they enhance Express.js applications...",
    image: "https://miro.medium.com/v2/resize:fit:1000/0*55IwzpvP6yQfxFs-.png",
  },
  {
    id: 3,
    title: "JWT Authentication in MERN Stack",
    excerpt: "Secure your applications with JWT authentication. Step-by-step implementation...",
    image: "https://blog.logrocket.com/wp-content/uploads/2021/06/jwt-authentication-best-practices.png",
  },
];

const initialRecentBlogs = [
  {
    id: 4,
    title: "Building RESTful APIs with Express",
    excerpt: "Learn how to create RESTful APIs using Express.js and Node.js...",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTH7ZuWbQtQ33tRnTRfJGHUGTnMV0e2KxV9g&s",
  },
  {
    id: 5,
    title: "Exploring GraphQL: A New Way to Query APIs",
    excerpt: "Discover how GraphQL can simplify data fetching in your applications...",
    image: "https://graphql.com/graphql-dot-com.jpg",
  },
  {
    id: 6,
    title: "Deploying Your MERN Stack Application",
    excerpt: "A step-by-step guide to deploying your MERN stack application to production...",
    image: "https://clickysoft.com/wp-content/uploads/2023/11/Benefits-of-MERN-Stack-Developers.jpg",
  },
];

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blogify
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/recent">Recent Post</Button>
        <Button color="inherit" component={Link} to="/membership">Membership</Button>
        <Button color="inherit" component={Link} to="/create">Create Blog</Button> {/* New button added */}
      </Toolbar>
    </AppBar>
  );
};

const HomePage = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState(initialFeaturedBlogs);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('https://blogify-9j1d.onrender.com/api/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const filteredBlogs = response.data.filter(blog => !localStorage.getItem(`deleted_${blog._id}`));
        setUserBlogs(filteredBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const addBlog = (newBlog) => {
    setFeaturedBlogs((prev) => [...prev, newBlog]);
    setUserBlogs((prev) => [...prev, newBlog]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleDelete = async (blogId) => {
    if (!blogId) {
      showMessage('Invalid blog ID', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showMessage('Please log in again', 'error');
          navigate('/login');
          return;
        }

        const response = await axios({
          method: 'DELETE',
          url: `https://blogify-9j1d.onrender.com/api/blogs/${blogId}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Mark blog as deleted in localStorage
          localStorage.setItem(`deleted_${blogId}`, 'true');
          
          // Update UI
          setUserBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
          showMessage('Blog deleted successfully', 'success');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          showMessage('Blog deleted', 'info');
          localStorage.setItem(`deleted_${blogId}`, 'true');
          setUserBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
        } else {
          showMessage(error.response?.data?.message || 'Error deleting blog', 'error');
        }
      }
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    
    try {
      const response = await axios.post(
        'https://blogify-9j1d.onrender.com/api/subscribers/subscribe',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // Add timeout
        }
      );
      
      console.log('Subscription response:', response);
      showMessage('Successfully subscribed! Check your email for confirmation.', 'success');
      setEmail('');
    } catch (error) {
      console.error('Subscription error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 'Error subscribing. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, textAlign: 'center', backgroundImage: 'url(https://source.unsplash.com/1600x900/?nature)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Welcome to <strong>Blogify</strong>
              </Typography>
              <Typography variant="h6" gutterBottom>
                Your daily dose of thoughts, stories, and ideas.
              </Typography>
              <Box component="form" onSubmit={handleSubscribe} noValidate sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <TextField
                  label="Your email address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mr: 1, backgroundColor: 'white', width: '300px' }}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  type="submit"
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Box>
              <Typography variant="body2">
                Get the email newsletter and unlock access to members-only content and updates.
              </Typography>
            </Box>

            {/* My Blogs Section - Only show if there are blogs */}
            {userBlogs && userBlogs.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                  My <strong>Blog Posts</strong>
                </Typography>
                <Grid container spacing={4}>
                  {loading ? (
                    <Typography>Loading blogs...</Typography>
                  ) : (
                    userBlogs.map((blog) => (
                      <Grid item xs={12} sm={6} md={4} key={blog._id}>
                        <Card sx={{ 
                          transition: 'transform 0.3s', 
                          '&:hover': { transform: 'scale(1.05)' },
                          height: '100%', // Make cards equal height
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={blog.image || 'https://source.unsplash.com/random'}
                            alt={blog.title}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {blog.title}
                              </Link>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {blog.excerpt}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton 
                                onClick={() => handleDelete(blog._id)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </>
            )}

            {/* Featured Posts Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Get started with our <strong>best stories</strong>
            </Typography>
            <Grid container spacing={4}>
              {featuredBlogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {blog.title}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blog.excerpt}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Recent Posts Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              See what we’ve <strong>written lately</strong>
            </Typography>
            <Grid container spacing={4}>
              {initialRecentBlogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {blog.title}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blog.excerpt}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Footer Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, mt: 4 }}>
              <Typography variant="body2" align="center">
                &copy; Blogify 2022. Published by <span style={{ color: 'white', textDecoration: 'underline' }}>codewithsadee</span>.
              </Typography>
              <Typography variant="body2" align="center">
                <Link to="/about" style={{ color: 'white', textDecoration: 'underline', marginRight: '10px' }}>About</Link>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'underline' }}>Contact</Link>
              </Typography>
            </Box>
          </>
        } />
        <Route path="/create" element={<CreateBlogPage addBlog={addBlog} />} /> {/* Route for CreateBlogPage */}
      </Routes>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;