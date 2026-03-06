import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    guide: string;
    teamMembers: string[];
    domain: string;
    image: string;
    paperUrl: string;
    year: number;
    published: boolean;
    createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    guide: { type: String, default: '' },
    teamMembers: [String],
    domain: { type: String, default: '' },
    image: { type: String, default: '' },
    paperUrl: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
