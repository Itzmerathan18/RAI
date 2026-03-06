import { NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();

    try {
        const body = await req.json();
        const { data, folder = 'rai-website', resource_type = 'auto' } = body;

        if (!data) {
            return Response.json({ success: false, message: 'No data provided' }, { status: 400 });
        }

        const result = await cloudinary.uploader.upload(data, {
            folder,
            resource_type,
        });

        return Response.json({ success: true, url: result.secure_url, public_id: result.public_id });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        return Response.json({ success: false, message }, { status: 500 });
    }
}
