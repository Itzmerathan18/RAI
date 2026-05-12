import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'rai_jnnce_secret_2024';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return Response.json({ success: false, message: 'No token' }, { status: 401 });
        }

        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        return Response.json({ success: true, user: decoded });
    } catch {
        return Response.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
}
