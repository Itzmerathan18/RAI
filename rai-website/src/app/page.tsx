'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiArrowDown } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// SVG Robot Arm Removed

/* ─── Cyber Grid Floor ───────────────────────────────────────────── */
function CyberFloor() {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(i => (
                    <line key={i} x1={200 + i * 8} y1="0" x2={200 + i * 160} y2="80"
                        stroke="#00E5FF" strokeWidth="0.5" opacity="0.15" />
                ))}
                {[0.15, 0.3, 0.5, 0.7, 1].map((t, i) => (
                    <line key={i} x1={200 - t * 200} y1={t * 80} x2={200 + t * 200} y2={t * 80}
                        stroke="#00E5FF" strokeWidth="0.5" opacity={0.05 + t * 0.12} />
                ))}
            </svg>
        </div>
    );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
type StatItem = { label: string; value: number; suffix: string; icon: string };

const DEFAULT_STATS: StatItem[] = [
    { label: 'Expert Faculty', value: 12, suffix: '+', icon: '👨‍🏫' },
    { label: 'Student Strength', value: 240, suffix: '+', icon: '👨‍🎓' },
    { label: 'Research Projects', value: 15, suffix: '+', icon: '🤖' },
    { label: 'Placement Rate', value: 90, suffix: '%', icon: '📈' },
    { label: 'Industry Partners', value: 20, suffix: '+', icon: '🏢' },
    { label: 'Publications', value: 60, suffix: '+', icon: '📚' },
];

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
    const { ref, inView } = useInView({ triggerOnce: true });
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.09 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card p-5 text-center group border border-white/5 hover:border-cyber/30 hover:shadow-glow transition-all duration-300">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div className="font-orbitron text-3xl font-black text-cyber mb-1">
                {inView ? <CountUp end={stat.value} duration={2.2} suffix={stat.suffix} /> : '0'}
            </div>
            <div className="text-xs text-white/45 uppercase tracking-wider">{stat.label}</div>
        </motion.div>
    );
}

type Notice = { tag: string; text: string; date: string };
const DEFAULT_NOTICES: Notice[] = [];

const tagColors: Record<string, string> = {
    Exam: 'bg-red-500/15 text-red-400 border border-red-500/20',
    Event: 'bg-cyber/10 text-cyber border border-cyber/20',
    Scholarship: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    Circular: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    Admission: 'bg-green-500/15 text-green-400 border border-green-500/20',
    General: 'bg-white/10 text-white/60 border border-white/10',
    Holiday: 'bg-green-600/15 text-green-400 border border-green-500/20',
    Placement: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
    Result: 'bg-pink-500/15 text-pink-400 border border-pink-500/20',
};

const researchAreas = [
    { icon: '🦾', title: 'Industrial Robotics', desc: 'Pick-and-place automation, robotic arms, PLC integration, and factory floor systems.' },
    { icon: '👁', title: 'Computer Vision', desc: 'Object detection, YOLO, OpenCV, real-time visual intelligence for robots.' },
    { icon: '🧠', title: 'AI & Machine Learning', desc: 'Deep learning, reinforcement learning, GPU computing, and neural networks.' },
    { icon: '🚗', title: 'Autonomous Systems', desc: 'Self-driving principles, SLAM, path planning, LiDAR and sensor fusion.' },
    { icon: '⚙️', title: 'Industrial Automation', desc: 'SCADA, IoT integration, Smart Manufacturing, Industry 4.0 protocols.' },
    { icon: '🤝', title: 'Human-Robot Interaction', desc: 'Collaborative robots (cobots), gesture recognition, safety systems.' },
];

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
    const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);

    useEffect(() => {
        setMounted(true);
        // Fetch analytics for live stats
        fetch('/api/analytics').then(r => r.json()).then(json => {
            if (json.success && json.data) {
                const d = json.data;
                setStats([
                    { label: 'Expert Faculty', value: d.faculty || 12, suffix: '+', icon: '👨‍🏫' },
                    { label: 'Student Strength', value: 240, suffix: '+', icon: '👨‍🎓' },
                    { label: 'Research Projects', value: d.research || 15, suffix: '+', icon: '🤖' },
                    { label: 'Placement Rate', value: 90, suffix: '%', icon: '📈' },
                    { label: 'Publications', value: d.publications || 60, suffix: '+', icon: '📚' },
                    { label: 'Achievements', value: d.achievements || 20, suffix: '+', icon: '🏆' },
                ]);
            }
        }).catch(() => { });
        // Fetch recent notices
        fetch('/api/notices?limit=4&isActive=true').then(r => r.json()).then(json => {
            if (json.data?.length) {
                setNotices(json.data.map((n: any) => ({
                    tag: n.category,
                    text: n.title,
                    date: new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                })));
            }
        }).catch(() => { });
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden bg-black">

            {/* ════ HERO ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center overflow-hidden">

                {/* Real JNNCE campus photo as background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/images/jnnce-campus.jpeg)',
                        opacity: 0.18,
                        filter: 'grayscale(40%) brightness(0.6)',
                    }}
                />

                {/* Cyber grid overlay */}
                <div className="cyber-grid" />

                {/* Cyan orbs */}
                <div className="orb w-[600px] h-[600px] bg-cyan-900" style={{ top: '-150px', left: '-150px', opacity: 0.08 }} />
                <div className="orb w-[400px] h-[400px] bg-cyan-700" style={{ bottom: '0', right: '-100px', opacity: 0.06, animationDelay: '3s' }} />

                {/* Scan line */}
                <div className="absolute inset-0 pointer-events-none scan-line" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
                    <div className="grid lg:grid-cols-12 gap-8 items-center">

                        {/* ── Center Hero Text ── */}
                        <div className="col-span-12 xl:col-span-12 flex flex-col items-center text-center">

                            {/* College Logo and Identity FIRST */}
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="mb-4 flex flex-col items-center">
                                {/* JNNCE LOGO */}
                                <div className="p-3 mb-6 bg-white rounded-full shadow-glow">
                                    <img src="/images/jnnce-logo.png" alt="JNNCE Logo" className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
                                </div>
                                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs sm:text-sm font-orbitron tracking-widest uppercase shadow-glow mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
                                    Est. 1980 · VTU Affiliated · NAAC A Grade · AICTE Approved
                                </div>
                            </motion.div>

                            {/* JNNCE name */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                                className="mb-1">
                                <div className="text-white/35 text-xs font-space uppercase tracking-[0.3em] mb-2">
                                    Jawaharlal Nehru National College of Engineering
                                </div>
                                <div className="text-white/25 text-xs font-space tracking-wider">Shivamogga, Karnataka — India</div>
                            </motion.div>

                            {/* Department name — big orbitron */}
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                <h1 className="font-orbitron font-black leading-none mt-6 mb-2" style={{ fontSize: 'clamp(1.6rem, 5vw, 3.6rem)' }}>
                                    <span className="gradient-text">ROBOTICS &amp;</span>
                                </h1>
                                <h1 className="font-orbitron font-black leading-none mb-6" style={{ fontSize: 'clamp(1.6rem, 5vw, 3.6rem)' }}>
                                    <span className="text-white">ARTIFICIAL INTELLIGENCE</span>
                                </h1>
                                <div className="cyber-line my-2 max-w-xs mx-auto" />
                            </motion.div>

                            {/* Tagline */}
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="text-white/40 text-sm font-space tracking-[0.18em] uppercase mb-8">
                                Innovation &nbsp;·&nbsp; Automation &nbsp;·&nbsp; AI &nbsp;·&nbsp; Robotics
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4 justify-center mb-10">
                                <Link href="/about" className="btn-primary">
                                    Explore Department <FiArrowRight />
                                </Link>
                                <Link href="/research" className="btn-secondary">Research Areas</Link>
                                <Link href="/labs" className="btn-secondary">View Labs</Link>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                                className="flex flex-wrap justify-center gap-6">
                                {[
                                    { val: '60', label: 'Intake / Year' },
                                    { val: 'B.E.', label: '4-Year Programme' },
                                    { val: '5', label: 'Research Labs' },
                                    { val: '90%', label: 'Placement Rate' },
                                ].map(b => (
                                    <div key={b.label} className="text-center">
                                        <div className="font-orbitron text-cyber text-lg font-bold">{b.val}</div>
                                        <div className="text-white/30 text-xs tracking-wider uppercase">{b.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right side element removed as we centralized the logo */}
                        <div className="hidden xl:flex xl:col-span-2 h-72 items-end justify-center">
                        </div>
                    </div>
                </div>

                {/* Cyber floor grid */}
                {mounted && <CyberFloor />}

                {/* Scroll indicator */}
                <motion.a href="#stats" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center gap-2 hover:text-cyber transition-colors">
                    <span className="text-xs font-orbitron tracking-widest uppercase">Scroll</span>
                    <FiArrowDown />
                </motion.a>
            </section>

            {/* ════ STATS ══════════════════════════════════════════════════════════ */}
            <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                        Department at a Glance
                    </div>
                    <h2 className="section-title text-3xl text-white mb-2">Numbers That Define <span className="gradient-text-static">Excellence</span></h2>
                    <p className="text-white/35 font-space text-sm">JNNCE RAI · Building intelligent engineers since 2020</p>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
                </div>
            </section>

            {/* ════ ABOUT RAI ══════════════════════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="glass-card-cyan p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-5">About the Department</div>
                            <h2 className="section-title text-2xl text-white mb-4">Dept. of Robotics &amp; Artificial Intelligence</h2>
                            <p className="text-white/55 leading-relaxed mb-4 font-space">
                                Established in <strong className="text-cyber">2020</strong>, the Department of RAI at JNNCE is an interdisciplinary programme blending
                                <strong className="text-white"> Robotics, AI, Mechatronics, Control Systems, and Embedded Systems</strong> — preparing
                                engineers to build intelligent machines for Industry 4.0 and beyond.
                            </p>
                            <p className="text-white/55 leading-relaxed mb-6 font-space">
                                Affiliated to <strong className="text-white">VTU, Belagavi</strong>, recognised by <strong className="text-white">AICTE</strong> and
                                the Government of Karnataka, with an annual intake of <strong className="text-cyber">60 students</strong>.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '🏛', label: 'JNNCE Est.', value: '1980' },
                                    { icon: '🤖', label: 'RAI Dept.', value: '2020' },
                                    { icon: '📞', label: 'Phone', value: '08182-225341' },
                                    { icon: '📍', label: 'Location', value: 'Navule, Shivamogga' },
                                ].map(item => (
                                    <div key={item.label} className="p-3 rounded-xl border border-white/6 bg-white/3 hover:border-cyber/20 transition-colors">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span>{item.icon}</span>
                                            <span className="text-xs text-white/30 uppercase tracking-wider font-orbitron">{item.label}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-white">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            {[
                                '75+ highly qualified faculty, 45+ with Ph.D in engineering disciplines',
                                'NAAC Accredited A Grade by Government of Karnataka',
                                'AICTE-IDEA Lab — hands-on innovation lab aligned with NEP 2020',
                                'GPU-powered AI & ML Research Lab for deep learning research',
                                'RoboDK simulation labs + dedicated hardware interaction labs',
                                'Active industry collaborations: ABB, Bosch, Siemens, FANUC',
                                '66 Mbps campus internet · VTU top performer in Shivamogga',
                            ].map((h, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-cyber/3 hover:bg-cyber/6 border border-cyber/8 hover:border-cyber/20 transition-all">
                                    <span className="text-cyber flex-shrink-0 mt-0.5 font-bold text-sm">✓</span>
                                    <span className="text-sm text-white/60 font-space">{h}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════ RESEARCH AREAS ════════════════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Research Focus</div>
                    <h2 className="section-title text-2xl text-white mb-3">Core Research <span className="gradient-text-static">Areas</span></h2>
                    <p className="text-white/35 text-sm">Active projects funded by VTU, DST-SERB, DRDO, and AICTE</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {researchAreas.map((r, i) => (
                        <motion.div key={r.title}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                            whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.4)' }}
                            className="glass-card p-6 border border-white/5 hover:shadow-glow transition-all duration-300 group cursor-default">
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{r.icon}</div>
                            <h3 className="font-orbitron font-bold text-sm text-cyber mb-2 uppercase tracking-wider">{r.title}</h3>
                            <p className="text-sm text-white/45 leading-relaxed font-space">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/research" className="btn-secondary text-sm">View All Research <FiArrowRight /></Link>
                </div>
            </section>

            {/* ════ PLACEMENTS ════════════════════════════════════════════════════ */}
            <section className="py-16" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.03), transparent)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-5">Placements 2024</div>
                            <h2 className="section-title text-2xl text-white mb-5">Industry-Ready <span className="gradient-text-static">Graduates</span></h2>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { label: 'Highest Package', value: '18 LPA' },
                                    { label: 'Avg Package', value: '8.5 LPA' },
                                    { label: 'Placement Rate', value: '90%' },
                                ].map(p => (
                                    <div key={p.label} className="glass-card-cyan p-4 text-center">
                                        <div className="font-orbitron text-xl font-black text-cyber">{p.value}</div>
                                        <div className="text-xs text-white/35 mt-1 font-space">{p.label}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-white/45 mb-5 leading-relaxed text-sm font-space">Top recruiters include ABB Robotics, Bosch, Siemens, Infosys, TCS, Wipro and 15+ more companies hiring our engineers for automation, AI, and software roles.</p>
                            <Link href="/placements" className="btn-primary text-sm">Full Placement Dashboard <FiArrowRight /></Link>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="glass-card-cyan p-6">
                                <h3 className="font-orbitron font-bold text-xs text-cyber uppercase tracking-widest mb-4">Top Recruiters 2024</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {['ABB Robotics', 'Bosch', 'Siemens', 'Infosys', 'TCS', 'Wipro', 'FANUC', 'Capgemini', 'HCL'].map(c => (
                                        <motion.div key={c} whileHover={{ scale: 1.05, borderColor: 'rgba(0,229,255,0.4)' }}
                                            className="p-3 rounded-xl bg-black border border-white/6 text-center text-xs text-white/50 hover:text-cyber transition-all cursor-default font-space">
                                            {c}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════ NOTICES ═══════════════════════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="section-title text-xl text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-7 rounded-full bg-cyber" />
                            Latest Notices
                        </h2>
                        <div className="space-y-3">
                            {notices.map((n, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                                    <Link href="/notices"
                                        className="flex items-start gap-3 p-4 glass-card hover:border-cyber/20 transition-all group">
                                        <span className={`badge flex-shrink-0 text-xs ${tagColors[n.tag] || 'bg-white/10 text-white/40'}`}>{n.tag}</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-white/65 group-hover:text-white transition-colors font-space">{n.text}</p>
                                            <p className="text-xs text-white/25 mt-1">📅 {n.date}</p>
                                        </div>
                                        <FiArrowRight className="text-white/15 group-hover:text-cyber transition-colors mt-0.5 flex-shrink-0" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <Link href="/notices" className="mt-4 btn-secondary inline-flex text-sm">All Notices <FiArrowRight /></Link>
                    </div>

                    <div>
                        <h2 className="section-title text-xl text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-7 rounded-full bg-cyber" />
                            Quick Access
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { emoji: '📖', label: 'Syllabus & Curriculum', href: '/academics' },
                                { emoji: '👨‍🏫', label: 'Faculty Directory', href: '/faculty' },
                                { emoji: '🔬', label: 'Research Projects', href: '/research' },
                                { emoji: '🧪', label: 'Laboratories', href: '/labs' },
                                { emoji: '🏆', label: 'Placements', href: '/placements' },
                                { emoji: '🖼', label: 'Gallery', href: '/gallery' },
                            ].map(ql => (
                                <motion.div key={ql.label} whileHover={{ scale: 1.03 }}>
                                    <Link href={ql.href}
                                        className="flex items-center gap-3 p-4 glass-card hover:border-cyber/25 hover:bg-cyber/4 transition-all group">
                                        <span className="text-2xl">{ql.emoji}</span>
                                        <span className="text-sm text-white/55 group-hover:text-cyber transition-colors font-space">{ql.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════ CTA ════════════════════════════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass-card-cyan p-10 text-center relative overflow-hidden">
                    <div className="cyber-grid absolute inset-0 opacity-50" />
                    <div className="relative z-10">
                        <div className="font-orbitron text-cyber text-xs uppercase tracking-widest mb-3">Join the Future of Engineering</div>
                        <h2 className="section-title text-2xl text-white mb-4">Ready to Build Intelligent Machines?</h2>
                        <p className="text-white/45 mb-7 max-w-lg mx-auto font-space text-sm">
                            Contact us for admissions, research collaborations, or industry partnerships with the Dept. of Robotics &amp; AI at JNNCE.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/contact" className="btn-primary">Contact Department <FiArrowRight /></Link>
                            <Link href="/about" className="btn-secondary">Learn More</Link>
                        </div>
                        <div className="mt-6 text-xs text-white/20 font-space">
                            📍 JNNCE, Navule, Savalanga Road, Shivamogga – 577201 &nbsp;|&nbsp; 📞 08182-225341 &nbsp;|&nbsp; ✉ rai@jnnce.ac.in
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
