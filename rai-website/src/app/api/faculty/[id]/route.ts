import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import FacultyModel from '@/models/Faculty';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const doc = await FacultyModel.findById(params.id);
        if (!doc) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
        return Response.json({ success: true, data: doc });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();
    try {
        await connectDB();
        const body = await req.json();
        const doc = await FacultyModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!doc) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
        return Response.json({ success: true, data: doc });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();
    try {
        await connectDB();
        const doc = await FacultyModel.findByIdAndDelete(params.id);
        if (!doc) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
        return Response.json({ success: true, message: 'Deleted successfully' });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}
