// backend/routes/auth.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret'; // Use a strong secret in .env

// --- User Registration --- (Example)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, name: newUser.name, message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// --- User Login --- (Example)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      name: user.name,
      userId: user._id.toString(), // Include userId in response
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- Admin Login ---
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide admin email and password' });
    }

    try {
        const db = await connectToDatabase();
        const adminsCollection = db.collection('admins');

        // Find admin by email
        const admin = await adminsCollection.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, message: 'Admin login successful' });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during admin login' });
    }
});

// --- Get All Users ---
router.get('/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        // Fetch all users
        const users = await usersCollection.find({}).toArray();
        
        // Remove sensitive information like passwords
        const sanitizedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }));

        res.status(200).json(sanitizedUsers);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

// --- Initialize Admin Account ---
router.post('/admin/init', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const adminsCollection = db.collection('admins');

        // Check if admin already exists
        const existingAdmin = await adminsCollection.findOne({ email: 'admin@01' });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin account already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin account
        const newAdmin = {
            email: 'admin@01',
            password: hashedPassword,
            createdAt: new Date()
        };

        await adminsCollection.insertOne(newAdmin);
        res.status(201).json({ success: true, message: 'Admin account created successfully' });

    } catch (error) {
        console.error('Admin initialization error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;