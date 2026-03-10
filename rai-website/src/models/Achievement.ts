import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  studentName: String,
  achievementTitle: String,
  eventName: String,
  date: Date,
  image: String,
});

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
