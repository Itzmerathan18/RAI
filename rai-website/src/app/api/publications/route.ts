import { connectDB } from "@/lib/db";
import Publication from "@/models/Publication";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectDB();
    const publications = await Publication.find().sort({ year: -1 });
    return NextResponse.json(publications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch publications" },
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
    const publication = await Publication.create(body);
    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create publication" },
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
    const publication = await Publication.findByIdAndUpdate(id, data, { new: true });
    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(publication);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update publication" },
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
    await Publication.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete publication" },
      { status: 500 }
    );
  }
}


