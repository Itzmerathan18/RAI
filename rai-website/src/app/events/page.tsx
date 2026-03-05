'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiFilter } from 'react-icons/fi';

const CATS = ['All', 'Workshop', 'Competition', 'Guest Lecture', 'Hackathon', 'Industrial Visit'];
const events = [
    { id: 1, title: 'National Robotics Championship 2023', category: 'Competition', date: '20 Nov 2023', venue: 'BMS College of Engineering, Bengaluru', desc: 'Students won 2nd place in the national-level robotics design challenge. Built an autonomous delivery bot.', emoji: '🤖', upcoming: false },
    { id: 2, title: 'Expert Talk: Future of AI in Manufacturing', category: 'Guest Lecture', date: '15 Jan 2024', venue: 'Seminar Hall, JNNCE', desc: 'Mr. Ramesh Iyer, Principal Engineer at ABB Robotics, spoke on collaborative robots and smart factories.', emoji: '🎤', upcoming: false },
    { id: 3, title: 'ROS2 & Gazebo Workshop (2 Days)', category: 'Workshop', date: '5 Feb 2024', venue: 'Robotics Lab, JNNCE', desc: '2-day hands-on workshop on ROS2 Humble, Nav2, and Gazebo simulation with 50+ participants.', emoji: '🖥️', upcoming: false },
    { id: 4, title: 'Robothon 2024 – Annual Hackathon', category: 'Hackathon', date: '20 Apr 2024', venue: 'JNNCE Campus', desc: 'Inter-college 24-hour robotics hackathon with 30+ teams competing.', emoji: '🚀', upcoming: true },
    { id: 5, title: 'Industrial Visit to Bosch, Bengaluru', category: 'Industrial Visit', date: '10 Mar 2024', venue: 'Bosch Limited, Bengaluru', desc: 'Students visited the Bosch manufacturing plant and automation assembly lines.', emoji: '🏭', upcoming: false },
    { id: 6, title: 'Deep Learning Bootcamp – 3 Days', category: 'Workshop', date: '25 Apr 2024', venue: 'AI Lab, JNNCE', desc: 'Hands-on training on PyTorch, CNNs, and object detection models.', emoji: '🧠', upcoming: true },
];

export default function EventsPage() {
    const [cat, setCat] = useState('All');
    const [tab, setTab] = useState<'all' | 'upcoming'>('all');
    const filtered = events.filter(e => (cat === 'All' || e.category === cat) && (tab === 'all' || e.upcoming));

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Events & Gallery</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Events & Activities</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Workshops, competitions, guest lectures, and student-driven hackathons</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
                    <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                        {(['all', 'upcoming'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-white/50 hover:text-white'}`}>
                                {t === 'all' ? 'All Events' : '🔜 Upcoming'}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <FiFilter className="text-white/30 self-center" />
                        {CATS.map(c => (
                            <button key={c} onClick={() => setCat(c)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${cat === c ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((ev, i) => (
                        <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card overflow-hidden hover:border-primary-500/40 transition-all duration-300">
                            <div className="h-32 bg-gradient-to-br from-primary-900/50 to-dark-800 flex items-center justify-center text-5xl">
                                {ev.emoji}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`badge text-xs ${ev.upcoming ? 'bg-accent-500/20 text-accent-400' : 'bg-white/10 text-white/50'}`}>
                                        {ev.upcoming ? '🔜 Upcoming' : '✅ Completed'}
                                    </span>
                                    <span className="badge bg-primary-500/10 text-primary-300 text-xs">{ev.category}</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2 leading-snug">{ev.title}</h3>
                                <p className="text-sm text-white/50 mb-3 leading-relaxed">{ev.desc}</p>
                                <div className="space-y-1 text-xs text-white/30">
                                    <div className="flex items-center gap-2"><FiCalendar className="text-primary-400" />{ev.date}</div>
                                    <div className="flex items-center gap-2"><FiMapPin className="text-accent-400" />{ev.venue}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        <div className="text-5xl mb-4">📅</div>
                        <p>No events found for this filter</p>
                    </div>
                )}
            </section>
        </div>
    );
}
