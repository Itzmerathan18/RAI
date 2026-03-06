import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
    title: string;
    category: string;
    thumbnail: string;
    images: string[];
    videos: string[];
    description: string;
    results: string;
    date: string;
    eventDuration: string;
    status: 'ongoing' | 'completed';
    published: boolean;
    createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ['Events', 'Competitions', 'Cultural', 'Projects', 'Industrial Visits', 'Students', 'Workshops', 'Laboratories', 'College Events'],
        default: 'Events',
    },
    thumbnail: { type: String, default: '' },
    images: [String],
    videos: [String],
    description: { type: String, default: '' },
    results: { type: String, default: '' },
    date: { type: String, default: '' },
    eventDuration: { type: String, default: '' },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'completed' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
