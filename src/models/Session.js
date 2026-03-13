import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema(
  {
    token:     { type: String, required: true, unique: true },
    email:     { type: String, required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
)

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)
