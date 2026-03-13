import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    id:               { type: String, unique: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true },
    verificationCode: { type: String },
    verified:         { type: Boolean, default: false },
    name:             { type: String, default: null },
    role:             { type: String, default: null },
    teamSize:         { type: String, default: null },
    workspaceId:      { type: String, default: null },
    focus:            { type: String, default: null },
    plan:             { type: String, default: 'Free' },
    status:           { type: String, default: 'Active' },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
