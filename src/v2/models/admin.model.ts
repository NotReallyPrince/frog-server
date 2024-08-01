import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define User Document Interface
export interface IAdmin extends Document {
  username: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// Define User Schema
const UserSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving the user document
UserSchema.pre('save', async function (next) {
  const user = this as IAdmin;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Export the User model
export const AdminModel = mongoose.model<IAdmin>('Admin', UserSchema);
