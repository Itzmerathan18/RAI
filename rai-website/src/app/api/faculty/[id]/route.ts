import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await fetch(`${API}/faculty/${params.id}`, { next: { revalidate: 60 } });
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ success: false, message: 'Backend unavailable' }, { status: 503 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const token = req.headers.get('Authorization') || '';
    try {
        const res = await fetch(`${API}/faculty/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ success: false, message: 'Backend unavailable' }, { status: 503 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('Authorization') || '';
    try {
        const res = await fetch(`${API}/faculty/${params.id}`, {
            method: 'DELETE',
            headers: { Authorization: token },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ success: false, message: 'Backend unavailable' }, { status: 503 });
    }
}
