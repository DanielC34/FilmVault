import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  avatar_url: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
