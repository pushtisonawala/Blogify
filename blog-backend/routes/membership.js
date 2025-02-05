const express = require('express');
const router = express.Router();

// Debug logs
console.log('Setting up membership routes...');

// Simple POST endpoint
router.post('/subscribe', (req, res) => {
    try {
        console.log('POST /subscribe request received:', req.body);
        const { planType, price } = req.body;

        // Validation
        if (!planType || !price) {
            return res.status(400).send({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Success response
        return res.status(200).send({
            success: true,
            message: `Successfully subscribed to ${planType} plan`,
            data: { planType, price, date: new Date() }
        });
    } catch (err) {
        console.error('Error in membership route:', err);
        return res.status(500).send({
            success: false,
            message: 'Server error'
        });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.send({ message: 'Membership routes are working' });
});

console.log('Membership routes setup complete');

module.exports = router;
