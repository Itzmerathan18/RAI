import mongoose from "mongoose";

const ResearchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  // guide is kept as legacy alias; use facultyGuide
  guide: { type: String, default: "" },
  facultyGuide: { type: String, default: "" },
  teamMembers: { type: [String], default: [] },
  domain: { type: String, default: "" },
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },
  fundingAgency: { type: String, default: "" },
  fundedAmount: { type: String, default: "" },
  year: { type: Number },
  thumbnail: { type: String, default: "" },
  images: { type: [String], default: [] },
  paperUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Research || mongoose.model("Research", ResearchSchema);
