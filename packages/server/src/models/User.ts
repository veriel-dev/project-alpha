import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'editor', 'viewer'], 
    default: 'editor' 
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});
// Hash de contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});
// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
