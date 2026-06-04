/**
 * ============================================================================
 * 🚀 REAL MONGODB MCP SERVER IMPLEMENTATION (BACKEND REFERENCE)
 * ============================================================================
 * 
 * IMPORTANT SECURITY NOTICE:
 * You provided your connection string. It has been added below. 
 * NEVER put this connection string in your React frontend files (.tsx/.ts). 
 * It must ONLY live in a backend environment like this Node.js server.
 * 
 * Setup Instructions for your local machine or Cloud Run:
 * 1. mkdir groundup-backend && cd groundup-backend
 * 2. npm init -y
 * 3. npm install mongodb express cors dotenv
 * 4. Save this file as server.js (uncomment the code below)
 * 5. node server.js
 */

/*
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Added your specific connection string here. 
// Note: Removed the < > brackets around the password as they cause connection errors.
// In a production environment, it is highly recommended to use process.env.MONGODB_URI instead of hardcoding it.
const uri = process.env.MONGODB_URI || "mongodb+srv://jacobdho888_db_user:MechaFreddy888!!!@groundupproject.trtb12d.mongodb.net/?appName=GroundUpProject";
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('groundup_db');
        console.log("✅ Connected to MongoDB MCP Database");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
}

connectDB();

// --- MCP TOOL ENDPOINTS ---

// Tool: save_user_profile
app.post('/mcp/save_user_profile', async (req, res) => {
    try {
        const { userId, profileData } = req.body;
        const usersCollection = db.collection('users');
        
        await usersCollection.updateOne(
            { userId: userId || 'default_user' },
            { $set: { ...profileData, updatedAt: new Date() } },
            { upsert: true }
        );
        
        res.json({ status: 'success', message: 'Profile saved to MongoDB' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Tool: get_user_profile
app.get('/mcp/get_user_profile/:userId', async (req, res) => {
    try {
        const usersCollection = db.collection('users');
        const profile = await usersCollection.findOne({ userId: req.params.userId || 'default_user' });
        res.json({ status: 'success', profile });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Tool: log_transaction
app.post('/mcp/log_transaction', async (req, res) => {
    try {
        const { userId, transaction } = req.body;
        const txCollection = db.collection('transactions');
        
        const newTx = { ...transaction, userId: userId || 'default_user', createdAt: new Date() };
        await txCollection.insertOne(newTx);
        
        // Also update the user's profile array for quick access
        await db.collection('users').updateOne(
            { userId: userId || 'default_user' },
            { $push: { transactions: newTx } }
        );
        
        res.json({ status: 'success', transactionId: newTx._id });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 MongoDB MCP Server running on port ${PORT}`);
});
*/
