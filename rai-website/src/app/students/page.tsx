'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';

const awards = [
    { name: 'Rahul S.', batch: '2021-25', category: 'Hackathon', title: '1st Prize – Smart India Hackathon 2023', desc: 'Built autonomous fire-fighting robot using ROS2.', emoji: '🏆' },
    { name: 'Pooja M.', batch: '2021-25', category: 'Research', title: 'Best FYP Award 2024', desc: 'AI-based gesture-controlled robotic arm.', emoji: '🤖' },
    { name: 'Arjun T.', batch: '2022-26', category: 'Competition', title: '2nd Place – National Robotics Championship', desc: 'Line-following robot achieved 99.8% accuracy.', emoji: '🥈' },
    { name: 'Sneha D.', batch: '2021-25', category: 'Startup', title: 'JNNCE Incubation Award 2024', desc: 'AI-powered classroom attendance system startup.', emoji: '🚀' },
    { name: 'Kiran M.', batch: '2022-26', category: 'Hackathon', title: 'Winner – IEEE R10 Hackathon', desc: 'IoT-based smart agriculture monitoring system.', emoji: '🌾' },
    { name: 'Divya P.', batch: '2023-27', category: 'Research', title: 'Best Paper – ICRA Student Workshop', desc: 'Published research on SLAM for quadruped robots.', emoji: '📄' },
];

const cats = ['All', 'Hackathon', 'Competition', 'Research', 'Startup'];

const clubs = [
    { name: 'Robotics Club', icon: '🤖', desc: 'Builds and competes at national robotics events.', members: 60 },
    { name: 'AI & Data Science Club', icon: '🧠', desc: 'Weekly ML hackathons, Kaggle competitions, and workshops.', members: 80 },
    { name: 'IEEE Student Branch', icon: '⚡', desc: 'Technical talks, seminars, and international competitions.', members: 45 },
    { name: 'Makers & Innovation Cell', icon: '🔧', desc: '3D printing, prototyping, and startup incubation.', members: 55 },
];

export default function StudentsPage() {
    const [cat, setCat] = useState('All');
    const filtered = awards.filter(a => cat === 'All' || a.category === cat);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Student Excellence</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Student Achievements</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Hackathons, competitions, research, and startups — our students are making a mark nationally and globally</p>
                </motion.div>

                {/* Filter */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                    <FiFilter className="text-white/30" />
                    {cats.map(c => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filtered.map((a, i) => (
                        <motion.div key={a.name + a.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300">
                            <div className="text-4xl mb-3">{a.emoji}</div>
                            <span className={`badge text-xs mb-3 ${a.category === 'Hackathon' ? 'bg-blue-500/20 text-blue-300' : a.category === 'Research' ? 'bg-purple-500/20 text-purple-300' : a.category === 'Startup' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{a.category}</span>
                            <h3 className="font-semibold text-white mb-1 leading-snug">{a.title}</h3>
                            <p className="text-sm text-white/50 mb-3 leading-relaxed">{a.desc}</p>
                            <div className="flex items-center gap-2 text-xs text-white/30">
                                <span>👤 {a.name}</span>
                                <span>•</span>
                                <span>🎓 Batch {a.batch}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Student Clubs */}
                <h2 className="section-title text-3xl text-white mb-6">Student Clubs & Chapters</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {clubs.map((club, i) => (
                        <motion.div key={club.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                            className="glass-card p-6 text-center hover:border-accent-500/30 transition-all">
                            <div className="text-4xl mb-3">{club.icon}</div>
                            <h3 className="font-semibold text-white mb-2">{club.name}</h3>
                            <p className="text-sm text-white/50 mb-3">{club.desc}</p>
                            <span className="badge bg-acc-500/20 text-accent-400 text-xs">👥 {club.members} members</span>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
