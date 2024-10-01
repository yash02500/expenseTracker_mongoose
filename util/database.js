// Connecting to mongodb database
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose'); // import mongoose

const uri = process.env.URI;  // uri connection

const mongoConnect = async () => {
  try {
    await mongoose.connect(uri);  // connecting to database
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error); 
  }
};

module.exports = mongoConnect;
