import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
    title: string;
    description: string;
    date: string;
    documentUrl: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
}

const NoticeSchema = new Schema<INotice>({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    category: {
        type: String,
        enum: ['circular', 'notice', 'exam', 'event', 'other'],
        default: 'notice',
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
