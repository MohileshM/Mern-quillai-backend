import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 25 },
  },
  { timestamps: true }
);

const generationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    template: String,
    prompt: String,
    tone: String,
    output: String,
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export const Generation = mongoose.model('Generation', generationSchema);
