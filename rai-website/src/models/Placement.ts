import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacement extends Document {
    studentName: string;
    company: string;
    role: string;
    package: string;
    year: number;
    photo: string;
    batch: string;
    createdAt: Date;
}

const PlacementSchema = new Schema<IPlacement>({
    studentName: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, default: '' },
    package: { type: String, default: '' },
    year: { type: Number, required: true },
    photo: { type: String, default: '/images/default-avatar.png' },
    batch: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Placement || mongoose.model<IPlacement>('Placement', PlacementSchema);
