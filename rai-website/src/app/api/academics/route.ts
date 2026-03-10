import { connectDB } from "@/lib/db";
import Academics from "@/models/Academics";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const academics = await Academics.find().sort({ uploadedDate: -1 });
    return NextResponse.json(academics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch academics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const academic = await Academics.create(body);
    return NextResponse.json(academic, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create academic" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const academic = await Academics.findByIdAndUpdate(id, data, { new: true });
    if (!academic) {
      return NextResponse.json(
        { error: "Academic not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(academic);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update academic" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    await Academics.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete academic" },
      { status: 500 }
    );
  }
}
