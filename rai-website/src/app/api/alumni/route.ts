import { connectDB } from "@/lib/db";
import Alumni from "@/models/Alumni";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const alumni = await Alumni.find().sort({ year: -1 });
    return NextResponse.json(alumni);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    const alumni = await Alumni.create(body);
    return NextResponse.json(alumni, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create alumni" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const alumni = await Alumni.findByIdAndUpdate(id, data, { new: true });
    if (!alumni) {
      return NextResponse.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(alumni);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update alumni" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }
    await Alumni.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete alumni" },
      { status: 500 }
    );
  }
}


