import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
    name: string;
    designation: string;
    qualification: string;
    specialization: string;
    experience: number;
    researchAreas: string[];
    publications: { title: string; journal: string; year: number; link: string }[];
    patents: { title: string; year: number }[];
    email: string;
    phone: string;
    photo: string;
    googleScholarLink: string;
    linkedinLink: string;
    isSupportStaff: boolean;
    createdAt: Date;
}

const FacultySchema = new Schema<IFaculty>({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },
    researchAreas: [String],
    publications: [{ title: String, journal: String, year: Number, link: String }],
    patents: [{ title: String, year: Number }],
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    photo: { type: String, default: '/images/default-avatar.png' },
    googleScholarLink: { type: String, default: '' },
    linkedinLink: { type: String, default: '' },
    isSupportStaff: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);
