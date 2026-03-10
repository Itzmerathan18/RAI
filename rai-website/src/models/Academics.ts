import mongoose from "mongoose";

const AcademicsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["scheme_syllabus", "academic_calendar", "poco_mapping", "lab_schedule"],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedDate: { type: Date, default: Date.now },
});

export default mongoose.models.Academics || mongoose.model("Academics", AcademicsSchema);
