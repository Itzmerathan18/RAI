import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import ResearchModel from '@/models/Research';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const filter: Record<string, unknown> = {};
        const domain = searchParams.get('domain');
        if (domain) filter.domain = domain;
        const status = searchParams.get('status');
        if (status) filter.status = status;
        const published = searchParams.get('published');
        if (published === 'true') filter.published = true;

        const data = await ResearchModel.find(filter).sort({ year: -1, createdAt: -1 });
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
        const doc = await ResearchModel.create(body);
        return Response.json({ success: true, data: doc }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}
