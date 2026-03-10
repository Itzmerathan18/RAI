import { connectDB } from "@/lib/db";
import Faculty from "@/models/Faculty";
import Research from "@/models/Research";
import Gallery from "@/models/Gallery";
import Notice from "@/models/Notice";
import Publication from "@/models/Publication";
import Project from "@/models/Project";
import Alumni from "@/models/Alumni";
import Achievement from "@/models/Achievement";
import Placement from "@/models/Placement";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCounts() {
  await connectDB();
  const [
    facultyCount, researchCount, galleryCount, noticeCount,
    publicationCount, projectCount, alumniCount, achievementCount, placementCount,
  ] = await Promise.all([
    Faculty.countDocuments(),
    Research.countDocuments(),
    Gallery.countDocuments(),
    Notice.countDocuments(),
    Publication.countDocuments(),
    Project.countDocuments(),
    Alumni.countDocuments(),
    Achievement.countDocuments(),
    Placement.countDocuments(),
  ]);
  return {
    facultyCount, researchCount, galleryCount, noticeCount,
    publicationCount, projectCount, alumniCount, achievementCount, placementCount,
  };
}

const STATS_CONFIG = [
  { key: "facultyCount", label: "Faculty", icon: "👨‍🏫", color: "blue", href: "/admin/faculty" },
  { key: "researchCount", label: "Research Projects", icon: "🔬", color: "green", href: "/admin/research" },
  { key: "publicationCount", label: "Publications", icon: "📄", color: "indigo", href: "/admin/publications" },
  { key: "projectCount", label: "Student Projects", icon: "🤖", color: "cyan", href: "/admin/projects" },
  { key: "galleryCount", label: "Gallery Events", icon: "🖼️", color: "purple", href: "/admin/gallery" },
  { key: "noticeCount", label: "Notices", icon: "📢", color: "orange", href: "/admin/notices" },
  { key: "achievementCount", label: "Achievements", icon: "🏆", color: "yellow", href: "/admin/achievements" },
  { key: "placementCount", label: "Placements", icon: "💼", color: "rose", href: "/admin/placements" },
  { key: "alumniCount", label: "Alumni", icon: "🎓", color: "teal", href: "/admin/alumni" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; iconBg: string }> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600", ring: "ring-blue-200 dark:ring-blue-800", iconBg: "bg-blue-100 dark:bg-blue-900/40" },
  green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600", ring: "ring-green-200 dark:ring-green-800", iconBg: "bg-green-100 dark:bg-green-900/40" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600", ring: "ring-indigo-200 dark:ring-indigo-800", iconBg: "bg-indigo-100 dark:bg-indigo-900/40" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600", ring: "ring-cyan-200 dark:ring-cyan-800", iconBg: "bg-cyan-100 dark:bg-cyan-900/40" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600", ring: "ring-purple-200 dark:ring-purple-800", iconBg: "bg-purple-100 dark:bg-purple-900/40" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600", ring: "ring-orange-200 dark:ring-orange-800", iconBg: "bg-orange-100 dark:bg-orange-900/40" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600", ring: "ring-yellow-200 dark:ring-yellow-800", iconBg: "bg-yellow-100 dark:bg-yellow-900/40" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600", ring: "ring-rose-200 dark:ring-rose-800", iconBg: "bg-rose-100 dark:bg-rose-900/40" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-600", ring: "ring-teal-200 dark:ring-teal-800", iconBg: "bg-teal-100 dark:bg-teal-900/40" },
};

export default async function DashboardPage() {
  const counts = await getCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            RAI Department · JNNCE — {total} total records
          </p>
        </div>
        <div className="text-right text-xs text-gray-400 dark:text-gray-500">
          <div>Last updated</div>
          <div className="font-medium">{new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {STATS_CONFIG.map(({ key, label, icon, color, href }) => {
          const c = COLOR_MAP[color];
          const value = counts[key as keyof typeof counts];
          return (
            <Link
              key={key}
              href={href}
              className={`${c.bg} ring-1 ${c.ring} p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-200 group shadow-sm`}
            >
              <div className={`${c.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">{label}</p>
                <p className={`text-3xl font-black ${c.text} leading-none`}>{value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Add Faculty", href: "/admin/faculty", icon: "👨‍🏫" },
            { label: "Add Notice", href: "/admin/notices", icon: "📢" },
            { label: "Add Research", href: "/admin/research", icon: "🔬" },
            { label: "Add Gallery", href: "/admin/gallery", icon: "🖼️" },
            { label: "Add Project", href: "/admin/projects", icon: "🤖" },
          ].map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-gray-600 dark:text-gray-400 hover:text-blue-600 text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 text-xs text-gray-400 dark:text-gray-500 flex flex-wrap gap-4">
        <span>🗄 MongoDB Atlas connected</span>
        <span>☁️ Cloudinary CDN active</span>
        <span>🔒 JWT auth enabled</span>
        <span>⚡ Next.js 14 App Router</span>
      </div>
    </div>
  );
}
