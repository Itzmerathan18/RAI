import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || email.toLowerCase().trim() !== ADMIN_EMAIL) {
            return Response.json(
                { success: false, message: 'Access denied. Only rai@jnnce.ac.in can login.' },
                { status: 401 }
            );
        }

        // ── Try DB-backed login first ──────────────────────────────────────────
        try {
            const { connectDB } = await import('@/lib/db');
            const { default: User } = await import('@/models/User');
            await connectDB();

            let user = await User.findOne({ email: ADMIN_EMAIL });

            if (!user) {
                // First-ever login — seed the admin user
                const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
                user = await User.create({
                    name: 'RAI Admin',
                    email: ADMIN_EMAIL,
                    password: hashed,
                    role: 'super_admin',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch && password !== ADMIN_PASSWORD) {
                return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
            }

            const token = signToken({ id: String(user._id), role: user.role, email: user.email });
            return Response.json({
                success: true,
                token,
                user: { id: user._id, name: user.name, role: user.role, email: user.email },
            });
        } catch {
            // DB unavailable — fall back to hardcoded credentials and still issue a real JWT
            if (password !== ADMIN_PASSWORD) {
                return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
            }
            // Issue a real JWT so API routes that verify tokens still accept it
            const token = signToken({ id: 'admin', role: 'super_admin', email: ADMIN_EMAIL });
            return Response.json({
                success: true,
                token,
                user: { id: 'admin', name: 'RAI Admin', role: 'super_admin', email: ADMIN_EMAIL },
            });
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}
