import connectDB from '@/lib/db';
import FacultyModel from '@/models/Faculty';
import ResearchModel from '@/models/Research';
import PublicationModel from '@/models/Publication';
import NoticeModel from '@/models/Notice';
import LabModel from '@/models/Lab';
import AchievementModel from '@/models/Achievement';
import GalleryModel from '@/models/Gallery';
import AlumniModel from '@/models/Alumni';
import PlacementModel from '@/models/Placement';
import ProjectModel from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const [faculty, research, publications, notices, labs, achievements, gallery, alumni, placements, projects] =
            await Promise.all([
                FacultyModel.countDocuments(),
                ResearchModel.countDocuments(),
                PublicationModel.countDocuments(),
                NoticeModel.countDocuments({ isActive: true }),
                LabModel.countDocuments(),
                AchievementModel.countDocuments(),
                GalleryModel.countDocuments(),
                AlumniModel.countDocuments(),
                PlacementModel.countDocuments(),
                ProjectModel.countDocuments(),
            ]);

        return Response.json({
            success: true,
            data: { faculty, research, publications, notices, labs, achievements, gallery, alumni, placements, projects },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return Response.json({ success: false, message }, { status: 500 });
    }
}
