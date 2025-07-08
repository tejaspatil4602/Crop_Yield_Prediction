const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../db');

// Authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Data validation middleware
const validatePredictionData = (req, res, next) => {
    const { cropType, area, soilType, temperature, humidity, rainfall, nitrogen, phosphorus, potassium, ph } = req.body;
    
    // Type validation
    if (typeof area !== 'number' || 
        typeof temperature !== 'number' || 
        typeof humidity !== 'number' || 
        typeof rainfall !== 'number' || 
        typeof nitrogen !== 'number' || 
        typeof phosphorus !== 'number' || 
        typeof potassium !== 'number' || 
        typeof ph !== 'number') {
        return res.status(400).json({ message: 'Numeric fields must be numbers' });
    }

    // Range validation
    if (area <= 0 || 
        humidity < 0 || humidity > 100 || 
        temperature < -50 || temperature > 60 || 
        rainfall < 0 || 
        nitrogen < 0 || nitrogen > 140 || 
        phosphorus < 0 || phosphorus > 145 || 
        potassium < 0 || potassium > 205 || 
        ph < 0 || ph > 14) {
        return res.status(400).json({ message: 'One or more values are outside acceptable ranges' });
    }

    next();
};

// Create a new prediction record
router.post('/', authenticateUser, validatePredictionData, async (req, res) => {
    const { cropType, area, soilType, temperature, humidity, rainfall, nitrogen, phosphorus, potassium, ph, predictedYield } = req.body;
    const email = req.user.email;

    // Validate required fields
    if (!cropType || !soilType) {
        return res.status(400).json({ message: 'Crop type and soil type are required' });
    }

    try {
        const db = await connectToDatabase();
        const predictionsCollection = db.collection('predictions');

        // Create new prediction record with email
        const newPrediction = {
            email,
            cropType,
            area,
            soilType,
            temperature,
            humidity,
            rainfall,
            nitrogen,
            phosphorus,
            potassium,
            ph,
            predictedYield,
            createdAt: new Date()
        };

        await predictionsCollection.insertOne(newPrediction);
        res.status(201).json({ message: 'Prediction saved successfully', prediction: newPrediction });

    } catch (error) {
        console.error('Prediction save error:', error);
        res.status(500).json({ message: 'Server error while saving prediction' });
    }
});

// Get prediction history for a user
router.get('/user/:email', authenticateUser, async (req, res) => {
    try {
        const { email } = req.params;
        
        const db = await connectToDatabase();
        const predictionsCollection = db.collection('predictions');

        // Get all predictions for the user, sorted by creation date (newest first)
        const predictions = await predictionsCollection.find({ email })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(predictions);

    } catch (error) {
        console.error('Error fetching prediction history:', error);
        res.status(500).json({ message: 'Server error while fetching prediction history' });
    }
});

// Delete a prediction
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = await connectToDatabase();
        const predictionsCollection = db.collection('predictions');

        const result = await predictionsCollection.deleteOne(
            { _id: new ObjectId(id) }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Prediction not found' });
        }

        res.status(200).json({ message: 'Prediction deleted successfully' });

    } catch (error) {
        console.error('Error deleting prediction:', error);
        res.status(500).json({ message: 'Server error while deleting prediction' });
    }
});

module.exports = router;