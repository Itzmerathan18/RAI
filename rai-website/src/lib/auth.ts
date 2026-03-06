import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'rai_jnnce_super_secret_jwt_key_2024';

// ── Locked admin credentials ────────────────────────────────────────
export const ADMIN_EMAIL = 'rai@jnnce.ac.in';
export const ADMIN_PASSWORD = 'rai#@123';

export interface JwtPayload {
    id: string;
    role: string;
    email: string;
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

/** Extract and verify Bearer token from a Next.js request. Returns null if invalid. */
export function getAuthUser(req: NextRequest): JwtPayload | null {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    return verifyToken(token);
}

/** Returns 401 JSON response object */
export function unauthorizedResponse() {
    return Response.json({ success: false, message: 'Not authorized' }, { status: 401 });
}
