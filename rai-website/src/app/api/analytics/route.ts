import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET() {
    try {
        const res = await fetch(`${BACKEND}/analytics`, { next: { revalidate: 60 } });
        const json = await res.json();
        return NextResponse.json(json, { status: res.status });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
