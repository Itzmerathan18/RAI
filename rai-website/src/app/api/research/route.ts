import { connectDB } from "@/lib/db";
import Research from "@/models/Research";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const research = await Research.find().sort({ createdAt: -1 });
    return NextResponse.json(research);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch research" },
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
    const research = await Research.create(body);
    return NextResponse.json(research, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create research" },
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
    const research = await Research.findByIdAndUpdate(id, data, { new: true });
    if (!research) {
      return NextResponse.json(
        { error: "Research not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(research);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update research" },
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
    await Research.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete research" },
      { status: 500 }
    );
  }
}
