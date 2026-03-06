import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import ProjectModel from '@/models/Project';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const filter: Record<string, unknown> = {};
        const domain = searchParams.get('domain');
        if (domain) filter.domain = domain;
        const year = searchParams.get('year');
        if (year) filter.year = parseInt(year);
        const published = searchParams.get('published');
        if (published === 'true') filter.published = true;

        const data = await ProjectModel.find(filter).sort({ year: -1, createdAt: -1 });
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
        const doc = await ProjectModel.create(body);
        return Response.json({ success: true, data: doc }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 400 });
    }
}
