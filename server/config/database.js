import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Set mongoose options for better connection handling
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('Database connection error:', error.message);
    
    if (error.message.includes('MONGO_URI')) {
      console.error('Please check your .env file and ensure MONGO_URI is set correctly');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Cannot connect to MongoDB. Please check:');
      console.error('1. Your internet connection');
      console.error('2. MongoDB connection string is correct');
      console.error('3. Database server is running and accessible');
    }
    
    process.exit(1);
  }
};

export default connectDB;