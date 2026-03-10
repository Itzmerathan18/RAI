import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find().sort({ date: -1 });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notices" },
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
    const notice = await Notice.create(body);
    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notice" },
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
    const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notice" },
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
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}


