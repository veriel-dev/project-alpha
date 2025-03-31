import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/webbuilder',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  tokenExpiration: process.env.TOKEN_EXPIRATION || '7d',
};
