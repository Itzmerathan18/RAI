import { connectDB } from "@/lib/db";
import About from "@/models/About";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne();
    return NextResponse.json(about || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch about" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Check if document exists
    const existing = await About.findOne();
    if (existing) {
      const updated = await About.findByIdAndUpdate(existing._id, body, { new: true });
      return NextResponse.json(updated);
    }
    
    const about = await About.create(body);
    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save about" },
      { status: 500 }
    );
  }
}
