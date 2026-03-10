import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema({
  name: String,
  organization: String,
  role: String,
  year: Number,
});

export default mongoose.models.Alumni || mongoose.model("Alumni", AlumniSchema);
