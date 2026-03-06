import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
    collegeOverview: string;
    departmentOverview: string;
    vision: string;
    mission: string;
    hod: string;
    hodMessage: string;
    hodPhoto: string;
    updatedAt: Date;
}

// Singleton document — only one About document should exist
const AboutSchema = new Schema<IAbout>({
    collegeOverview: { type: String, default: '' },
    departmentOverview: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: { type: String, default: '' },
    hod: { type: String, default: '' },
    hodMessage: { type: String, default: '' },
    hodPhoto: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);
