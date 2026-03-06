import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
    studentName: string;
    achievementTitle: string;
    eventName: string;
    award: string;
    date: string;
    image: string;
    description: string;
    published: boolean;
    createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
    studentName: { type: String, required: true },
    achievementTitle: { type: String, required: true },
    eventName: { type: String, default: '' },
    award: { type: String, default: '' },
    date: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
