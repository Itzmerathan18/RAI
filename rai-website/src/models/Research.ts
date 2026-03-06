import mongoose, { Schema, Document } from 'mongoose';

export interface IResearch extends Document {
    title: string;
    thumbnail: string;
    facultyGuide: string;
    teamMembers: string[];
    fundedAmount: string;
    fundingAgency: string;
    description: string;
    paperUrl: string;
    domain: string;
    year: number;
    status: 'ongoing' | 'completed';
    published: boolean;
    createdAt: Date;
}

const ResearchSchema = new Schema<IResearch>({
    title: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    facultyGuide: { type: String, required: true },
    teamMembers: [String],
    fundedAmount: { type: String, default: '' },
    fundingAgency: { type: String, default: '' },
    description: { type: String, default: '' },
    paperUrl: { type: String, default: '' },
    domain: {
        type: String,
        enum: ['Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'],
        default: 'Other',
    },
    year: { type: Number, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Research || mongoose.model<IResearch>('Research', ResearchSchema);
