import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: String,
  currentCompany: String,
  designation: String,
  location: String,
  linkedInUrl: String,
  photo: String,
  message: String,
  // Legacy fields
  organization: String,
  role: String,
  year: Number,
}, { timestamps: true });

export default mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema);
