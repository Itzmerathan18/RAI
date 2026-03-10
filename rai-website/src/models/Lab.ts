import mongoose from "mongoose";

const LabSchema = new mongoose.Schema({
  labName: { type: String, required: true },
  description: String,
  equipment: [String],
  images: [String],
});

export default mongoose.models.Lab || mongoose.model("Lab", LabSchema);
