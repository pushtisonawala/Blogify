const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    excerpt: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add any virtual fields or methods here if needed
blogSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;