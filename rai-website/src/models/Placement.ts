import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  studentName: String,
  company: String,
  role: String,
  package: String,
  year: Number,
});

export default mongoose.models.Placement || mongoose.model("Placement", PlacementSchema);
