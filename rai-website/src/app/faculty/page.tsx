'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMail, FiFilter, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

const SPECS = ['All', 'Robotics', 'AI/ML', 'Control Systems', 'Embedded Systems', 'Mechatronics', 'Computer Vision', 'IoT'];

type Faculty = {
    _id: string;
    name: string;
    designation: string;
    qualification: string;
    specialization: string;
    experience: number;
    email: string;
    photo?: string;
    researchAreas?: string[] | string;
    googleScholarLink?: string;
    linkedinLink?: string;
};

const specColors: Record<string, string> = {
    Robotics: 'bg-blue-500/20 text-blue-300',
    'AI/ML': 'bg-purple-500/20 text-purple-300',
    'Control Systems': 'bg-orange-500/20 text-orange-300',
    'Embedded Systems': 'bg-green-500/20 text-green-300',
    Mechatronics: 'bg-yellow-500/20 text-yellow-300',
    'Computer Vision': 'bg-red-500/20 text-red-300',
    IoT: 'bg-cyan-500/20 text-cyan-300',
};

export default function FacultyPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/faculty');
                const json = await res.json();
                setFaculty(json.data || []);
            } catch {
                setFaculty([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = faculty.filter(f =>
        (filter === 'All' || f.specialization === filter) &&
        (f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.specialization?.toLowerCase().includes(search.toLowerCase()) ||
            (Array.isArray(f.researchAreas) ? f.researchAreas.join(' ') : (f.researchAreas || '')).toLowerCase().includes(search.toLowerCase()))
    );

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');
    const getResearchArr = (r?: string[] | string): string[] => {
        if (!r) return [];
        if (Array.isArray(r)) return r;
        return r.split(',').map(s => s.trim()).filter(Boolean);
    };

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Faculty' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Our Team</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Faculty Members</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Experienced educators and researchers — driving innovation in robotics, AI, and automation at JNNCE</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
                    {[
                        { value: faculty.length.toString(), label: 'Faculty Members' },
                        { value: `${Math.max(...faculty.map(f => f.experience || 0), 0)}+`, label: 'Max Experience (Yrs)' },
                        { value: `${faculty.length > 0 ? Math.round(faculty.reduce((sum, f) => sum + (f.experience || 0), 0) / faculty.length) : 0}+`, label: 'Avg Experience (Yrs)' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <div className="text-2xl font-display font-black gradient-text">{s.value}</div>
                            <div className="text-xs text-white/40 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty by name or specialization…"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <FiFilter className="text-white/30" />
                        {SPECS.map(s => (
                            <button key={s} onClick={() => setFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                )}

                {/* Grid */}
                {!loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((member, i) => (
                            <motion.div key={member._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -4, scale: 1.01 }}
                                className="glass-card p-6 transition-all duration-300 group hover:border-primary-500/30 hover:shadow-glow">
                                {/* Avatar */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {member.photo && member.photo !== '/images/default-avatar.png' ? (
                                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-700 to-accent-700 flex items-center justify-center text-xl font-bold text-white">
                                                {getInitials(member.name)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white leading-tight text-sm">{member.name}</h3>
                                        <p className="text-xs text-white/40 leading-tight mt-0.5">{member.designation}</p>
                                        <span className={`badge text-xs mt-1.5 ${specColors[member.specialization] || 'bg-white/10 text-white/50'}`}>{member.specialization}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4 text-xs text-white/40">
                                    <div>🎓 {member.qualification}</div>
                                    <div>📅 {member.experience} yrs experience</div>
                                </div>

                                {getResearchArr(member.researchAreas).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {getResearchArr(member.researchAreas).slice(0, 3).map(area => (
                                            <span key={area} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">{area}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-white/5">
                                    <a href={`mailto:${member.email}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-primary-500/10 text-white/40 hover:text-primary-300 transition-all text-xs">
                                        <FiMail className="w-3.5 h-3.5" /> Email
                                    </a>
                                    <Link href={`/faculty/${member._id}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-cyber/10 text-white/40 hover:text-cyber transition-all text-xs">
                                        <FiExternalLink className="w-3.5 h-3.5" /> Profile
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        <div className="text-5xl mb-4">🔍</div>
                        <p>{faculty.length === 0 ? 'No faculty profiles added yet. Check the admin dashboard.' : 'No faculty found matching your criteria.'}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
