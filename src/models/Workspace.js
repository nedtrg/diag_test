import mongoose from 'mongoose'

const WorkspaceSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    ownerId: { type: String, required: true },
    members: { type: [String], default: [] },
    invites: { type: [String], default: [] },
  },
  { timestamps: true }
)

export default mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema)
