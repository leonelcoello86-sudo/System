import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema(
  {
    ip: { type: String, default: '' },
    user: { type: String, required: true },
    date: { type: Date, default: () => new Date() },
    status: { type: String, enum: ['Concedido', 'Denegado'], default: 'Concedido' }
  },
  { timestamps: false }
);

export const AccessLog = mongoose.model('AccessLog', accessLogSchema);

