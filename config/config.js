// Import Mongoose library for MongoDB interaction

const mongoose = require('mongoose');
// Define an async function to connect to MongoDB

const connect = async () => {
    try {
        // Attempt to connect using the URI from .env
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected");
    } catch (error) {
        // Log failure if there's a connection error
        console.log("Database connection failed");
    }
};
// Export the connect function so it can be used in server.js
module.exports = connect;