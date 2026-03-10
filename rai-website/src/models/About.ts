import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  collegeOverview: { type: String, required: true },
  departmentOverview: { type: String, required: true },
  vision: String,
  mission: String,
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", AboutSchema);
