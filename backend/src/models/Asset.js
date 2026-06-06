import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    battery: { type: Number, min: 0, max: 100, default: 100 }
  },
  { timestamps: true }
);

export const Asset = mongoose.model('Asset', assetSchema);

