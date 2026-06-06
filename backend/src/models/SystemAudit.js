import mongoose from 'mongoose';

const systemAuditSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    event: { type: String, required: true },
    severity: { type: String, enum: ['Info', 'Alerta', 'Crítico'], default: 'Info' }
  },
  { timestamps: false }
);

export const SystemAudit = mongoose.model('SystemAudit', systemAuditSchema);

