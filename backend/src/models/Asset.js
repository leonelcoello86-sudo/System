import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    icon: {
      type: String,
      enum: ['soldado', 'vehiculo', 'dron'],
      required: true,
      default: 'soldado'
    },
    battery: { type: Number, min: 0, max: 100, default: null },
    fuel: { type: Number, min: 0, max: 100, default: null },
    personnel: { type: Number, min: 0, default: null },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Asset = mongoose.model('Asset', assetSchema);

