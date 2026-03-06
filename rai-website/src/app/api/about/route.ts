import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import AboutModel from '@/models/About';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        // Singleton — always get the first (and only) document
        let doc = await AboutModel.findOne({});
        if (!doc) {
            // Auto-create default empty document
            doc = await AboutModel.create({
                collegeOverview: 'JNNCE is a premier engineering institution in Karnataka.',
                departmentOverview: 'The Department of Robotics and AI offers cutting-edge programs.',
                vision: 'To be a centre of excellence in Robotics and Artificial Intelligence.',
                mission: 'To impart quality education and foster innovation in emerging technologies.',
            });
        }
        return Response.json({ success: true, data: doc });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();
    try {
        await connectDB();
        const body = await req.json();
        body.updatedAt = new Date();

        let doc = await AboutModel.findOne({});
        if (doc) {
            doc = await AboutModel.findByIdAndUpdate(doc._id, body, { new: true });
        } else {
            doc = await AboutModel.create(body);
        }
        return Response.json({ success: true, data: doc });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}
