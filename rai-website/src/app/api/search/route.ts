import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Global search: queries faculty, research, and publications simultaneously
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) return NextResponse.json({ success: true, data: { faculty: [], research: [], publications: [] } });

    try {
        const [fRes, rRes, pRes] = await Promise.allSettled([
            fetch(`${API}/faculty?search=${encodeURIComponent(q)}`, { next: { revalidate: 0 } }),
            fetch(`${API}/research?search=${encodeURIComponent(q)}`, { next: { revalidate: 0 } }),
            fetch(`${API}/publications?search=${encodeURIComponent(q)}`, { next: { revalidate: 0 } }),
        ]);

        const parse = async (r: PromiseSettledResult<Response>) => {
            if (r.status === 'fulfilled') { try { return (await r.value.json()).data || []; } catch { return []; } }
            return [];
        };

        const [faculty, research, publications] = await Promise.all([parse(fRes), parse(rRes), parse(pRes)]);
        return NextResponse.json({ success: true, data: { faculty, research, publications } });
    } catch {
        return NextResponse.json({ success: false, data: { faculty: [], research: [], publications: [] } }, { status: 200 });
    }
}
