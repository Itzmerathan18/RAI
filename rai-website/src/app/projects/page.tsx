'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_FILTERS = ['All', 'Robotics', 'AI/ML', 'Automation', 'Drone', 'IoT', 'Other'];

type Project = {
    _id: string;
    title: string;
    description: string;
    category: string;
    teamMembers: string[] | string;
    techStack: string[] | string;
    year: string | number;
    award?: string;
    githubUrl?: string;
    demoUrl?: string;
    thumbnail?: string;
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/projects');
                const json = await res.json();
                setProjects(json.data || []);
            } catch { setProjects([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const getArr = (v: string[] | string | undefined): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v;
        return v.split(',').map(s => s.trim()).filter(Boolean);
    };

    const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                    Student Innovation
                </div>
                <h1 className="section-title text-3xl text-white mb-3">
                    Student <span className="gradient-text-static">Projects</span>
                </h1>
                <p className="text-white/35 text-sm font-space">Real-world robotics and AI projects built by RAI students at JNNCE</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORY_FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-orbitron uppercase tracking-wider transition-all ${filter === f
                            ? 'bg-cyber text-black border border-cyber shadow-glow'
                            : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
                            }`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                </div>
            )}

            {/* Project Grid */}
            {!loading && (
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map((p, i) => (
                            <motion.div key={p._id} layout
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, delay: i * 0.06 }}
                                whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.35)' }}
                                className="glass-card p-6 border border-white/5 hover:shadow-glow transition-all duration-300 group flex flex-col">

                                {/* Top */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyber/10 border border-cyber/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-cyber/40 transition-colors overflow-hidden">
                                        {p.thumbnail ? (
                                            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                                        ) : '🤖'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="badge-cyber badge text-[10px]">{p.category}</span>
                                            <span className="text-[10px] text-white/25 font-space">{p.year}</span>
                                        </div>
                                        <h3 className="font-orbitron font-bold text-white text-sm leading-tight">{p.title}</h3>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-white/45 leading-relaxed font-space mb-4 flex-1">{p.description}</p>

                                {/* Award if any */}
                                {p.award && (
                                    <div className="mb-4 px-3 py-2 rounded-lg bg-cyber/6 border border-cyber/15 text-xs text-cyber font-space">
                                        🏆 {p.award}
                                    </div>
                                )}

                                {/* Team */}
                                {getArr(p.teamMembers).length > 0 && (
                                    <div className="mb-3">
                                        <div className="text-[10px] text-white/25 uppercase tracking-widest font-orbitron mb-1.5">Team</div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {getArr(p.teamMembers).map(m => (
                                                <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50 font-space">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tech stack */}
                                {getArr(p.techStack).length > 0 && (
                                    <div>
                                        <div className="text-[10px] text-white/25 uppercase tracking-widest font-orbitron mb-1.5">Tech Stack</div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {getArr(p.techStack).map(t => (
                                                <span key={t} className="px-2 py-0.5 rounded-full border border-cyber/20 bg-cyber/5 text-[10px] text-cyber font-space">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-white/20 font-space text-sm">
                    {projects.length === 0 ? 'No projects added yet. Add some from the admin dashboard.' : 'No projects in this category.'}
                </div>
            )}

            {/* Submit CTA */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="mt-14 glass-card p-8 text-center max-w-xl mx-auto">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-orbitron font-bold text-white text-base mb-2">Submit Your Project</h3>
                <p className="text-sm text-white/40 mb-5 font-space">RAI students can submit their projects for showcase. Contact the department with your project report.</p>
                <a href="mailto:rai@jnnce.ac.in" className="btn-primary text-sm">Submit via Email</a>
            </motion.div>
        </div>
    );
}
