import { connectDB } from "@/lib/db";
import Achievement from "@/models/Achievement";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find().sort({ date: -1 });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
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
    const achievement = await Achievement.create(body);
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create achievement" },
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
    const achievement = await Achievement.findByIdAndUpdate(id, data, { new: true });
    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update achievement" },
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
    await Achievement.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
}


