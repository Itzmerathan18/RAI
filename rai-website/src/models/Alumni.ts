import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumni extends Document {
    name: string;
    organization: string;
    role: string;
    year: number;
    photo: string;
    linkedinUrl: string;
    batch: string;
    createdAt: Date;
}

const AlumniSchema = new Schema<IAlumni>({
    name: { type: String, required: true },
    organization: { type: String, default: '' },
    role: { type: String, default: '' },
    year: { type: Number, required: true },
    photo: { type: String, default: '/images/default-avatar.png' },
    linkedinUrl: { type: String, default: '' },
    batch: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);
