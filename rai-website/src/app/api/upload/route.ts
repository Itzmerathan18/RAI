import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Accept JSON body with a base64 data URI (from api.ts uploadMedia)
    const body = await req.json();
    const { data, folder = "rai-website", resource_type = "auto" } = body;

    if (!data) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 });
    }

    const result: any = await cloudinary.uploader.upload(data, {
      folder,
      resource_type,
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
