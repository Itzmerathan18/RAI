'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const DOMAINS = ['All', 'Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT'];
const STATUS = ['All', 'ongoing', 'completed'];

const projects = [
    { id: 1, title: 'Autonomous Mobile Robot for Warehouse Navigation', desc: 'ROS-based AMR for indoor navigation with LiDAR and obstacle avoidance.', domain: 'Autonomous Robots', agency: 'VTU Research Fund', amount: '₹5 Lakhs', year: 2023, status: 'ongoing', faculty: 'Dr. Rajesh Kumar' },
    { id: 2, title: 'AI-Based Early Crop Disease Detection', desc: 'CNN-based system detecting plant diseases from smartphone images.', domain: 'Computer Vision', agency: 'DST SERB', amount: '₹12 Lakhs', year: 2022, status: 'completed', faculty: 'Dr. Priya Sharma' },
    { id: 3, title: 'SLAM-Based Search & Rescue Robot', desc: 'LiDAR-based SLAM for mapping unknown environments during disaster scenarios.', domain: 'SLAM', agency: 'DRDO', amount: '₹8 Lakhs', year: 2023, status: 'ongoing', faculty: 'Dr. Rajesh Kumar' },
    { id: 4, title: 'Smart Lab IoT Monitoring System', desc: 'Real-time lab equipment and environment monitoring using IoT.', domain: 'IoT', agency: 'AICTE', amount: '₹3 Lakhs', year: 2023, status: 'completed', faculty: 'Prof. Deepa M.' },
    { id: 5, title: 'AI-Driven Adaptive Control for Robotic Arms', desc: 'Reinforcement learning for precise robotic arm manipulation tasks.', domain: 'Control & Path Planning', agency: 'VGST', amount: '₹4 Lakhs', year: 2024, status: 'ongoing', faculty: 'Prof. Anil Naik' },
    { id: 6, title: 'Gesture-Controlled Wheelchair using CV', desc: 'Computer vision-based wheelchair controlled by hand gestures.', domain: 'Computer Vision', agency: 'College Internal Fund', amount: '₹1.5 Lakhs', year: 2024, status: 'ongoing', faculty: 'Prof. Kavitha R.' },
];

const publications = [
    { title: 'Autonomous Navigation Using SLAM in Dynamic Environments', journal: 'IEEE Transactions on Robotics', year: 2023, authors: 'Rajesh K., et al.' },
    { title: 'Real-Time Object Detection for Agricultural Robots Using YOLOv8', journal: 'Scopus Q1 Journal – Computers and Electronics in Agriculture', year: 2023, authors: 'Priya S., et al.' },
    { title: 'Reinforcement Learning for Adaptive PID Control in Robotic Systems', journal: 'Elsevier – Robotics and Autonomous Systems', year: 2022, authors: 'Anil N., Rajesh K.' },
    { title: 'IoT-Based Predictive Maintenance Framework for Industrial Robots', journal: 'IEEE Access', year: 2022, authors: 'Deepa M., et al.' },
];

export default function ResearchPage() {
    const [domainFilter, setDomainFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = projects.filter(p =>
        (domainFilter === 'All' || p.domain === domainFilter) &&
        (statusFilter === 'All' || p.status === statusFilter)
    );

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Research & Innovation</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Funded Projects & Research</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Government-funded, industry-sponsored, and internally funded research pushing the frontiers of robotics and AI</p>
                </motion.div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[{ label: 'Total Projects', value: '18+' }, { label: 'Funded (Govt/Industry)', value: '12' }, { label: 'Publications', value: '75+' }, { label: 'Patents Filed', value: '3' }].map(s => (
                        <div key={s.label} className="glass-card p-5 text-center">
                            <div className="text-3xl font-display font-black gradient-text">{s.value}</div>
                            <div className="text-xs text-white/50 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {DOMAINS.map(d => (
                        <button key={d} onClick={() => setDomainFilter(d)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${domainFilter === d ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {d}
                        </button>
                    ))}
                    <div className="border-l border-white/10 pl-3 flex gap-2">
                        {STATUS.map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${statusFilter === s ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filtered.map((proj, i) => (
                        <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`badge text-xs ${proj.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-300'}`}>
                                    {proj.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                                </span>
                                <span className="text-xs text-white/30">{proj.year}</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2 leading-snug flex-1">{proj.title}</h3>
                            <p className="text-sm text-white/50 mb-4 leading-relaxed">{proj.desc}</p>
                            <div className="space-y-1.5 text-xs text-white/40 border-t border-white/5 pt-3">
                                <div>🏛 {proj.agency} · {proj.amount}</div>
                                <div>👨‍🏫 {proj.faculty}</div>
                                <div>📂 {proj.domain}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Publications */}
                <div>
                    <h2 className="section-title text-3xl text-white mb-6" id="publications">📄 Selected Publications</h2>
                    <div className="space-y-4">
                        {publications.map((pub, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                                className="glass-card p-5 flex items-start gap-4 hover:border-primary-500/30 transition-all">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-300 font-bold text-sm flex-shrink-0">{i + 1}</div>
                                <div>
                                    <h3 className="font-medium text-white mb-1 leading-snug">{pub.title}</h3>
                                    <p className="text-sm text-accent-400 mb-1">{pub.journal}</p>
                                    <p className="text-xs text-white/40">{pub.authors} · {pub.year}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
