import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  journal: { type: String, default: "" },
  year: { type: Number },
  link: { type: String, default: "" },
}, { _id: false });

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, default: "" },
    qualification: { type: String, default: "" },
    specialization: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    researchAreas: { type: [String], default: [] },
    // legacy alias kept for backward compatibility
    expertise: { type: [String], default: [] },
    photo: { type: String, default: "" },
    googleScholarLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" },
    publications: { type: [PublicationSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);
