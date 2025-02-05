const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Change to false for testing
    },
    planType: {
        type: String,
        required: true,
        enum: ['Free', 'Pro', 'Premium']
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'cancelled', 'expired']
    }
}, { 
    timestamps: true,
    collection: 'memberships' // Explicitly set collection name
});

module.exports = mongoose.model('Membership', membershipSchema);
