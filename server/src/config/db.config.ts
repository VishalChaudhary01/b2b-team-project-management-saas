import mongoose from 'mongoose';
import { config } from './env.config';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB Database connected!');
  } catch (error) {
    console.error('❌ Failed to connect MongoDB Database');
    process.exit(1);
  }
};
