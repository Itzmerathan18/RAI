'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const CATS = ['All', 'Exam', 'Circular', 'Scholarship', 'Event', 'Admission'];
const notices = [
    { id: 1, title: 'Internal Assessment I Schedule – March 2024', desc: 'IA-I for all semester students scheduled from 15th March 2024.', category: 'Exam', date: '28 Feb 2024', isNew: true },
    { id: 2, title: 'Workshop on ROS2 and Gazebo – Registration Open', desc: 'Two-day hands-on workshop on ROS2 and Gazebo Simulation. Register before 10th March 2024.', category: 'Event', date: '25 Feb 2024', isNew: true },
    { id: 3, title: 'VTU Scholarship Applications 2024-25', desc: 'Eligible students can apply for VTU post-matric scholarships. Last date: 15 March 2024.', category: 'Scholarship', date: '20 Feb 2024', isNew: false },
    { id: 4, title: 'Robothon 2024 – Call for Registrations', desc: 'Annual inter-college robotics hackathon. Team size: 3-5 members. Register by 10th April.', category: 'Event', date: '18 Feb 2024', isNew: false },
    { id: 5, title: 'VTU Examinations Time Table – May/June 2024', desc: 'End semester examinations timetable released for all semesters.', category: 'Exam', date: '10 Feb 2024', isNew: false },
    { id: 6, title: 'Circular: New Academic Calendar 2024-25', desc: 'Revised academic calendar with holidays and exam schedules notified by VTU.', category: 'Circular', date: '1 Feb 2024', isNew: false },
];

const catColors: Record<string, string> = {
    Exam: 'bg-red-500/20 text-red-300',
    Event: 'bg-blue-500/20 text-blue-300',
    Scholarship: 'bg-yellow-500/20 text-yellow-300',
    Circular: 'bg-purple-500/20 text-purple-300',
    Admission: 'bg-green-500/20 text-green-300',
};

export default function NoticesPage() {
    const [cat, setCat] = useState('All');
    const filtered = notices.filter(n => cat === 'All' || n.category === cat);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Announcements</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Notices & Circulars</h1>
                    <p className="text-white/50">Stay updated with the latest announcements from the department</p>
                </motion.div>

                <div className="flex gap-2 flex-wrap mb-8 justify-center">
                    {CATS.map(c => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filtered.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="glass-card p-5 hover:border-primary-500/30 transition-all group cursor-pointer flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`badge text-xs ${catColors[n.category] || 'bg-white/10 text-white/50'}`}>{n.category}</span>
                                    {n.isNew && <span className="badge bg-accent-500/20 text-accent-400 text-xs">🆕 New</span>}
                                </div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors leading-snug">{n.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{n.desc}</p>
                                <p className="text-xs text-white/25 mt-2">📅 {n.date}</p>
                            </div>
                            <FiArrowRight className="text-white/20 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
