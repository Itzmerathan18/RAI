import { connectDB } from "@/lib/db";
import Faculty from "@/models/Faculty";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
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
    const faculty = await Faculty.create(body);
    return NextResponse.json(faculty, { status: 201 });
  } catch (error) {
    console.error("DEBUG FACULTY POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
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
    const faculty = await Faculty.findByIdAndUpdate(id, data, { new: true });
    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update faculty" },
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
    await Faculty.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}
