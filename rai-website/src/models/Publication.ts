import mongoose, { Schema, Document } from 'mongoose';

export interface IPublication extends Document {
    title: string;
    authors: string[];
    journal: string;
    year: number;
    paperUrl: string;
    doi: string;
    published: boolean;
    createdAt: Date;
}

const PublicationSchema = new Schema<IPublication>({
    title: { type: String, required: true },
    authors: [String],
    journal: { type: String, required: true },
    year: { type: Number, required: true },
    paperUrl: { type: String, default: '' },
    doi: { type: String, default: '' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Publication || mongoose.model<IPublication>('Publication', PublicationSchema);
