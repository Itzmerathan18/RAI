import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rai@jnnce.ac.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rai@123';
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'rai_jnnce_secret_2024';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ success: false, message: 'Email and password required' }, { status: 400 });
        }

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign(
            { email: ADMIN_EMAIL, role: 'super_admin', id: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return Response.json({
            success: true,
            token,
            user: { email: ADMIN_EMAIL, name: 'RAI Admin', role: 'super_admin', id: 'admin' }
        });
    } catch (error: any) {
        return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
    }
}
