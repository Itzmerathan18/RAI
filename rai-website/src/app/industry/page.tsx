'use client';
import { motion } from 'framer-motion';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

const mous = [
    { org: 'ABB Robotics India', type: 'Industry MoU', year: 2023, desc: 'Collaborative research on industrial robotics and student internship pipeline.' },
    { org: 'Bosch Limited', type: 'Industry MoU', year: 2023, desc: 'Automation and sensors partnership with sponsored lab equipment.' },
    { org: 'Siemens Healthineers', type: 'Industry MoU', year: 2022, desc: 'Medical robotics research and technical training workshops.' },
    { org: 'ISRO SAC', type: 'Research MoU', year: 2023, desc: 'Collaborative research on autonomous systems for space applications.' },
    { org: 'AgriBot AI (Startup)', type: 'Startup Partner', year: 2024, desc: 'Joint development of AI-powered crop monitoring and automation systems.' },
];

const workshops = [
    { title: 'Industrial Robotics Training', org: 'FANUC India', duration: '3 Days', year: 2023 },
    { title: 'AI for Industry 4.0', org: 'Infosys BPM', duration: '2 Days', year: 2024 },
    { title: 'PLC & SCADA Programming', org: 'Siemens', duration: '5 Days', year: 2023 },
];

export default function IndustryPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-300 text-sm mb-5">Industry Collaboration</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Industry Partners</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Strategic MoUs, sponsored labs, expert workshops, and internship pipelines with leading automation and AI companies</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Active MoUs', value: '12', icon: '🤝' },
                        { label: 'Industry Partners', value: '25+', icon: '🏢' },
                        { label: 'Internship Partners', value: '18', icon: '💼' },
                        { label: 'Sponsored Labs', value: '2', icon: '🔬' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-5 text-center">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className="text-3xl font-display font-black gradient-text">{s.value}</div>
                            <div className="text-xs text-white/40 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* MoUs */}
                <h2 className="section-title text-3xl text-white mb-6">Active MoUs & Partnerships</h2>
                <div className="space-y-4 mb-12">
                    {mous.map((m, i) => (
                        <motion.div key={m.org} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                            className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent-500/30 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-white">{m.org}</h3>
                                    <span className="badge bg-accent-500/20 text-accent-400 text-xs">{m.type}</span>
                                    <span className="text-xs text-white/30">Since {m.year}</span>
                                </div>
                                <p className="text-sm text-white/55">{m.desc}</p>
                            </div>
                            <button className="flex items-center gap-2 text-sm text-primary-300 hover:text-primary-200 transition-colors flex-shrink-0">
                                View MoU <FiExternalLink className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Workshops */}
                <h2 className="section-title text-3xl text-white mb-6">Industry-Sponsored Workshops</h2>
                <div className="grid md:grid-cols-3 gap-5">
                    {workshops.map((w, i) => (
                        <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                            className="glass-card p-6 hover:border-primary-500/40 transition-all">
                            <div className="text-3xl mb-3">🔧</div>
                            <h3 className="font-semibold text-white mb-2">{w.title}</h3>
                            <p className="text-sm text-primary-300 mb-1">by {w.org}</p>
                            <div className="flex gap-4 text-xs text-white/40 mt-3">
                                <span>⏱ {w.duration}</span>
                                <span>📅 {w.year}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
