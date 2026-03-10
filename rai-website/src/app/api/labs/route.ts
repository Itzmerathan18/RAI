import { connectDB } from "@/lib/db";
import Lab from "@/models/Lab";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const labs = await Lab.find().sort({ labName: 1 });
    return NextResponse.json(labs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch labs" },
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
    const lab = await Lab.create(body);
    return NextResponse.json(lab, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lab" },
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
    const lab = await Lab.findByIdAndUpdate(id, data, { new: true });
    if (!lab) {
      return NextResponse.json(
        { error: "Lab not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(lab);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update lab" },
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
    await Lab.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete lab" },
      { status: 500 }
    );
  }
}


