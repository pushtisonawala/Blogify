const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// Add test route
router.get('/test', (req, res) => {
  res.json({ message: 'Subscriber routes working' });
});

router.post('/subscribe', async (req, res) => {
    console.log('Received subscription request at:', new Date().toISOString());
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
        const { email } = req.body;

        if (!email) {
            console.log('Email missing in request');
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if subscriber already exists
        let subscriber = await Subscriber.findOne({ email });
        console.log('Existing subscriber:', subscriber);
        
        if (subscriber) {
            if (subscriber.active) {
                return res.status(400).json({ message: 'Already subscribed' });
            } else {
                // Reactivate subscription
                subscriber.active = true;
                await subscriber.save();
                return res.status(200).json({ message: 'Subscription reactivated' });
            }
        }

        // Create new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();
        console.log('New subscriber created:', subscriber);

        res.status(201).json({ message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Detailed subscription error:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'This email is already subscribed' });
        }
        res.status(500).json({ message: 'Error processing subscription' });
    }
});

module.exports = router;
