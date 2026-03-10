import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Faculty from "@/models/Faculty";
import Research from "@/models/Research";
import Publication from "@/models/Publication";
import Notice from "@/models/Notice";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q")?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json({ success: false, message: "Query too short" }, { status: 400 });
        }

        await connectDB();

        const regex = { $regex: q, $options: "i" };

        const [faculty, research, publications, notices, projects] = await Promise.all([
            Faculty.find({
                $or: [{ name: regex }, { designation: regex }, { specialization: regex }, { researchAreas: regex }],
            }).select("name designation specialization photo").limit(8).lean(),

            Research.find({
                $or: [{ title: regex }, { description: regex }, { facultyGuide: regex }, { domain: regex }],
            }).select("title description status year domain").limit(8).lean(),

            Publication.find({
                $or: [{ title: regex }, { authors: regex }, { journal: regex }],
            }).select("title authors journal year downloadUrl").limit(8).lean(),

            Notice.find({
                $or: [{ title: regex }, { description: regex }, { category: regex }],
            }).select("title description category important").limit(8).lean(),

            Project.find({
                $or: [{ title: regex }, { description: regex }, { technologies: regex }],
            }).select("title description technologies thumbnail").limit(8).lean(),
        ]);

        const total =
            faculty.length + research.length + publications.length + notices.length + projects.length;

        return NextResponse.json({
            success: true,
            query: q,
            total,
            data: { faculty, research, publications, notices, projects },
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ success: false, message: "Search failed" }, { status: 500 });
    }
}
