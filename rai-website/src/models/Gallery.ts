import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: ["events", "competitions", "cultural", "projects", "industrial_visit", "students", "workshop", "labs", "college"],
    required: true,
  },
  thumbnail: String,
  images: [String],
  videos: [String],
  eventDate: Date,
  duration: String,
  status: {
    type: String,
    enum: ["ongoing", "completed"],
  },
  description: String,
  results: String,
});

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
