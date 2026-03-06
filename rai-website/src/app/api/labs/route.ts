import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import LabModel from '@/models/Lab';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const data = await LabModel.find({}).sort({ labName: 1 });
        return Response.json({ success: true, count: data.length, data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, data: [], message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();
    try {
        await connectDB();
        const body = await req.json();
        const doc = await LabModel.create(body);
        return Response.json({ success: true, data: doc }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}
