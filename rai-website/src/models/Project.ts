import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'Other' },
  teamMembers: [String],
  techStack: [String],
  year: String,
  award: String,
  thumbnail: String,
  githubUrl: String,
  demoUrl: String,
  // Legacy fields
  guide: String,
  domain: String,
  image: String,
  paperUrl: String,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
