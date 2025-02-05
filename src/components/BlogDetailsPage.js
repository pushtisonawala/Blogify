import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Divider
} from '@mui/material';

const BlogDetailsPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Attempting to fetch blog with ID:', id);
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        console.log('Blog data received:', response.data);
        
        if (response.data) {
          setBlog(response.data);
        } else {
          setError('Blog not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.response?.data?.message || 'Error fetching blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container>
        <Typography align="center" variant="h5" sx={{ mt: 4 }}>
          Blog not found
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blogify
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {blog.title}
              </Typography>
              
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {blog.author && `By ${blog.author}`} • {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>

              <Box sx={{ my: 4, width: '100%', height: '400px', overflow: 'hidden' }}>
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="body1" sx={{ 
                whiteSpace: 'pre-line',
                fontSize: '1.1rem',
                lineHeight: 1.8 
              }}>
                {blog.content}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BlogDetailsPage;