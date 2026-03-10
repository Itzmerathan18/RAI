import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [String],
  journal: String,
  year: Number,
  paperUrl: String,
}, { timestamps: true });

export default mongoose.models.Publication || mongoose.model("Publication", PublicationSchema);
