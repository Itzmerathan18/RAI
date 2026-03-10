import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@jnnce.ac.in" });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin user already exists",
        email: "admin@jnnce.ac.in"
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("rai#@123", 10);
    
    const admin = await User.create({
      email: "admin@jnnce.ac.in",
      password: hashedPassword,
      name: "Admin",
    });

    return NextResponse.json({ 
      message: "✅ Admin user created successfully!",
      email: "admin@jnnce.ac.in",
      password: "rai#@123",
      id: admin._id
    });
  } catch (error) {
    console.error("Error seeding admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin user" },
      { status: 500 }
    );
  }
}
