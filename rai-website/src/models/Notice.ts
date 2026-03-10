import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ["General", "Exam", "Event", "Scholarship", "Holiday", "Placement", "Result"],
      default: "General",
    },
    important: { type: Boolean, default: false },
    link: { type: String, default: "" },
    // legacy field kept for backward compat
    documentUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);
