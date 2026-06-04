import { FinancialProfile, ChatMessage, Content } from '../types';

/**
 * ============================================================================
 * 🚀 MONGODB MCP SERVER INTEGRATION (FRONTEND SIMULATION)
 * ============================================================================
 * 
 * IMPORTANT NOTE ABOUT YOUR CONNECTION STRING:
 * You provided: mongodb+srv://jacobdho888_db_user:MechaFreddy888!!!@groundupproject.trtb12d.mongodb.net/?appName=GroundUpProject
 * 
 * NEVER put this string directly into your React frontend code (like this file). 
 * If you do, anyone on the internet can steal your database password.
 * 
 * Instead, that connection string goes into your Node.js backend (see backend-mcp-reference.js).
 * 
 * Since this app runs entirely in the browser sandbox, we cannot directly use 
 * `npm install mongodb` here. To ensure the app works right now, this service 
 * simulates the MongoDB collections using the browser's LocalStorage.
 * 
 * FOR YOUR HACKATHON SUBMISSION (WIRING IT UP):
 * Once you deploy your backend-mcp-reference.js to Cloud Run or Heroku, 
 * you will replace the localStorage code below with fetch calls. 
 */

export const MongoDbService = {
    // Simulates: db.collection('users').findOne({ userId })
    getProfile: async (): Promise<FinancialProfile | null> => {
        const user = localStorage.getItem('groundup_user');
        const goals = localStorage.getItem('groundup_goals');
        const txs = localStorage.getItem('groundup_transactions');
        const plans = localStorage.getItem('groundup_plans');

        if (!user) return null;

        const profile = JSON.parse(user);
        profile.goals = goals ? JSON.parse(goals) : [];
        profile.transactions = txs ? JSON.parse(txs) : [];
        const parsedPlans = plans ? JSON.parse(plans) : {};
        profile.quickWin = parsedPlans.quickWin || '';

        return profile;
    },

    // Simulates: db.collection('users').updateOne({ userId }, { $set: profile }, { upsert: true })
    saveProfile: async (profile: FinancialProfile): Promise<void> => {
        const { goals, transactions, quickWin, ...userData } = profile;
        
        // Mirroring MongoDB schema in localStorage for Guest Mode
        localStorage.setItem('groundup_user', JSON.stringify(userData));
        localStorage.setItem('groundup_goals', JSON.stringify(goals));
        localStorage.setItem('groundup_transactions', JSON.stringify(transactions));
        localStorage.setItem('groundup_plans', JSON.stringify({ quickWin }));
    },

    // Simulates: db.collection('chat_history').find({ userId }).toArray()
    getChatData: async (): Promise<{ messages: ChatMessage[], history: Content[] }> => {
        const data = localStorage.getItem('groundup_chat');
        return data ? JSON.parse(data) : { messages: [], history: [] };
    },

    // Simulates: db.collection('chat_history').updateOne(...)
    saveChatData: async (messages: ChatMessage[], history: Content[]): Promise<void> => {
        localStorage.setItem('groundup_chat', JSON.stringify({ messages, history }));
    },

    // Simulates: db.collection('sharing_cards').insertOne(...)
    saveSharedCard: async (token: string, profile: FinancialProfile): Promise<void> => {
        localStorage.setItem(`groundup_share_${token}`, JSON.stringify(profile));
    },

    // Simulates: db.collection('sharing_cards').findOne({ token })
    getSharedCard: async (token: string): Promise<FinancialProfile | null> => {
        const data = localStorage.getItem(`groundup_share_${token}`);
        return data ? JSON.parse(data) : null;
    },

    // Utility to reset the app
    clearAll: async (): Promise<void> => {
        localStorage.clear();
    }
};
