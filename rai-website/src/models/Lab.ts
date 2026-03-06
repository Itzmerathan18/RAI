import mongoose, { Schema, Document } from 'mongoose';

export interface ILab extends Document {
    labName: string;
    description: string;
    equipment: string[];
    images: string[];
    inCharge: string;
    published: boolean;
    createdAt: Date;
}

const LabSchema = new Schema<ILab>({
    labName: { type: String, required: true },
    description: { type: String, default: '' },
    equipment: [String],
    images: [String],
    inCharge: { type: String, default: '' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);
