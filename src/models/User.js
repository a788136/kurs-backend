import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ['google', 'github'], required: true },
    providerId: { type: String, required: true }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, index: true, unique: true, sparse: true },
    name: String,
    avatar: String,
    providers: { type: [ProviderSchema], default: [] },
    roles: { type: [String], default: ['user'] }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);