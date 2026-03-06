import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import NoticeModel from '@/models/Notice';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const filter: Record<string, unknown> = {};
        const category = searchParams.get('category');
        if (category) filter.category = category;
        const isActive = searchParams.get('isActive');
        if (isActive !== null) filter.isActive = isActive === 'true';

        const data = await NoticeModel.find(filter).sort({ createdAt: -1 });
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
        const doc = await NoticeModel.create(body);
        return Response.json({ success: true, data: doc }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}
