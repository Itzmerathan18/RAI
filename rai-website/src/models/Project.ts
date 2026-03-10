import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  guide: String,
  teamMembers: [String],
  domain: String,
  description: String,
  image: String,
  paperUrl: String,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
