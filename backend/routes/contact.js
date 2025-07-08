const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');

// Create contact request
router.post('/', async (req, res) => {
    const { name, phone, email, address, message } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !address || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const contactsCollection = db.collection('contacts');

        // Create new contact request
        const newContact = {
            name,
            phone,
            email,
            address,
            message,
            createdAt: new Date(),
            status: 'pending' // Can be used to track request status
        };

        await contactsCollection.insertOne(newContact);
        res.status(201).json({ message: 'Contact request submitted successfully' });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ message: 'Server error while submitting contact request' });
    }
});

// Get all contact requests (for admin)
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const contactsCollection = db.collection('contacts');

        // Get all contacts, sorted by creation date (newest first)
        const contacts = await contactsCollection.find()
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(contacts);

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error while fetching contacts' });
    }
});

// Update contact status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const db = await connectToDatabase();
        const contactsCollection = db.collection('contacts');

        const result = await contactsCollection.updateOne(
            { _id: new require('mongodb').ObjectId(id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact status updated successfully' });

    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({ message: 'Server error while updating contact status' });
    }
});

// Delete contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = await connectToDatabase();
        const contactsCollection = db.collection('contacts');

        const result = await contactsCollection.deleteOne(
            { _id: new require('mongodb').ObjectId(id) }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });

    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error while deleting contact' });
    }
});

module.exports = router;