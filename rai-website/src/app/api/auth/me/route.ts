import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const userPayload = getAuthUser(req);
    if (!userPayload) return Response.json({ success: false, message: 'Not authorized' }, { status: 401 });

    if (userPayload.id === 'admin') {
        // Handle fallback case where DB is unconnected but token is valid
        return Response.json({
            success: true,
            user: { id: 'admin', name: 'RAI Admin', role: 'super_admin', email: userPayload.email }
        });
    }

    try {
        await connectDB();
        const user = await User.findById(userPayload.id).select('-password');
        if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        return Response.json({ success: true, user });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}
