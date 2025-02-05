const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Import models, routes and middleware
const Blog = require('./models/blog');
const Subscriber = require('./models/subscriber');
const Membership = require('./models/membership');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const subscriberRoutes = require('./routes/subscriber');
const membershipRoutes = require('./routes/membership');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: ['https://blogify-smoky-six.vercel.app', 'https://blogify-1-6tey.onrender.com', 'https://blogify-git-main-pushti-sonawalas-projects.vercel.app', 'http://localhost:3000'], // Ensure this line is correct
    credentials: true,

    methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],


}));
app.use(helmet()); // Security middleware
app.use(compression()); // Compression middleware

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) throw new Error('MongoDB URI is not defined');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/membership', membershipRoutes); // Membership routes

// Test route
app.get('/test', (req, res) => {
    res.json({
        status: 'Server is running',
        routes: {
            membership: {
                base: '/api/membership',
                test: '/api/membership/test'
            }
        }
    });
});

// Catch-all route for 404s
app.use('*', (req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.url
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        path: req.originalUrl
    });
});

// Initialize server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('Available routes:', [
                '/api/auth',
                '/api/blogs',
                '/api/subscribers',
                '/api/membership'
            ]);
        });
    } catch (err) {
        console.error('Server startup error:', err);
        process.exit(1);
    }
};

startServer();