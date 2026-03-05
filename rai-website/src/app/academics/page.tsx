'use client';
import { motion } from 'framer-motion';
import { FiDownload, FiBookOpen } from 'react-icons/fi';

const semesters = [
    { sem: 1, subjects: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Programming for Problem Solving', 'Engineering Drawing'] },
    { sem: 2, subjects: ['Engineering Mathematics II', 'Elements of Electrical Engineering', 'Elements of Mechanical Engineering', 'Environmental Studies', 'Computer Programming Lab'] },
    { sem: 3, subjects: ['Mathematics for Machine Learning', 'Circuit Theory & Networks', 'Electronic Devices & Circuits', 'Data Structures with C', 'Electric Circuit Analysis Lab'] },
    { sem: 4, subjects: ['Digital Electronics', 'Signals & Systems', 'Microcontrollers & Embedded Systems', 'Object Oriented Programming (C++)', 'AI Fundamentals'] },
    { sem: 5, subjects: ['Robotics Kinematics & Dynamics', 'Machine Learning', 'Control Systems', 'Computer Vision', 'ROS Programming Lab'] },
    { sem: 6, subjects: ['Deep Learning', 'Advanced Robotics', 'Mechatronics', 'Autonomous Vehicles', 'Industrial Automation Lab'] },
    { sem: 7, subjects: ['Reinforcement Learning', 'Human Robot Interaction', 'SLAM & Navigation', 'Mini Project', 'Elective I'] },
    { sem: 8, subjects: ['Capstone Project (Major)', 'Industrial Internship / Research Project', 'Elective II', 'Technical Seminar'] },
];

export default function AcademicsPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Academics</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Curriculum & Syllabus</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Outcome-Based Education (OBE) aligned 4-year B.E. program in Robotics & Artificial Intelligence under VTU</p>
                </motion.div>

                {/* Program Info */}
                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Program', value: 'B.E. RAI', icon: '🎓' },
                        { label: 'Duration', value: '4 Years (8 Sems)', icon: '📅' },
                        { label: 'Affiliated', value: 'VTU, Belagavi', icon: '🏛' },
                        { label: 'Annual Intake', value: '60 Students', icon: '👥' },
                    ].map(p => (
                        <div key={p.label} className="glass-card p-5 text-center">
                            <div className="text-3xl mb-2">{p.icon}</div>
                            <div className="font-bold text-white">{p.value}</div>
                            <div className="text-xs text-white/40 mt-1">{p.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick downloads */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {['Scheme & Syllabus (PDF)', 'Academic Calendar 2024-25', 'PO-CO Mapping', 'Lab Schedules'].map(d => (
                        <button key={d} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 hover:bg-primary-500/20 transition-all text-sm">
                            <FiDownload className="w-4 h-4" /> {d}
                        </button>
                    ))}
                </div>

                {/* Semester Curriculum Grid */}
                <h2 className="section-title text-3xl text-white mb-6 flex items-center gap-3">
                    <FiBookOpen className="text-primary-400" /> Semester-wise Curriculum
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {semesters.map((s, i) => (
                        <motion.div key={s.sem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                            className="glass-card p-6 hover:border-primary-500/30 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg ${s.sem <= 2 ? 'bg-blue-500/20 text-blue-300' : s.sem <= 4 ? 'bg-primary-500/20 text-primary-300' : s.sem <= 6 ? 'bg-accent-500/20 text-accent-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                    S{s.sem}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Semester {s.sem}</h3>
                                    <p className="text-xs text-white/40">{s.subjects.length} subjects</p>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {s.subjects.map(sub => (
                                    <li key={sub} className="flex items-center gap-2 text-sm text-white/60">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                        {sub}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
