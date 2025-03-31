import { config } from './index';
import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    let connection = mongoose.connection;

    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    connection.on('disconnected', () => {
      console.warn('MongoDB disconnected, attempting to reconnect...');
    });

    console.log('MongoDB connection established');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};