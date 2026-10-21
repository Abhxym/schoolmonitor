const mongoose = require('mongoose');

let connected = false;

async function connect() {
    if (connected) return;
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
    // Fail fast instead of hanging for 30 s when Atlas is paused or blocks this IP
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
    connected = true;
    console.log('MongoDB connected');
}

const isConnected = () => mongoose.connection.readyState === 1;

module.exports = { connect, isConnected };
