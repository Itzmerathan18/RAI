'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Pagination from '@/components/ui/Pagination';

const DOMAINS = ['All', 'Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'];
const STATUS = ['All', 'ongoing', 'completed'];

type ResearchProject = {
    _id: string;
    title: string;
    description: string;
    domain: string;
    fundingAgency: string;
    fundedAmount: string;
    year: number;
    status: string;
    facultyGuide: string;
    paperUrl?: string;
    thumbnail?: string;
};

type Publication = {
    _id: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    downloadUrl?: string;
};

export default function ResearchPage() {
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [publications, setPublications] = useState<Publication[]>([]);
    const [domainFilter, setDomainFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQ, setSearchQ] = useState('');
    const [loadingR, setLoadingR] = useState(true);
    const [loadingP, setLoadingP] = useState(true);
    const [pubPage, setPubPage] = useState(1);
    const [pubPages, setPubPages] = useState(1);

    const fetchResearch = async () => {
        setLoadingR(true);
        try {
            const params = new URLSearchParams();
            if (domainFilter !== 'All') params.set('domain', domainFilter);
            if (statusFilter !== 'All') params.set('status', statusFilter);
            if (searchQ) params.set('search', searchQ);
            const res = await fetch(`/api/research?${params}`);
            const json = await res.json();
            setProjects(json.data || []);
        } catch { setProjects([]); }
        finally { setLoadingR(false); }
    };

    const fetchPublications = async (page = 1) => {
        setLoadingP(true);
        try {
            const res = await fetch(`/api/publications?page=${page}&limit=8`);
            const json = await res.json();
            setPublications(json.data || []);
            setPubPages(json.pages || 1);
        } catch { setPublications([]); }
        finally { setLoadingP(false); }
    };

    useEffect(() => { fetchResearch(); }, [domainFilter, statusFilter]);
    useEffect(() => { fetchPublications(pubPage); }, [pubPage]);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Research' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Research & Innovation</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Funded Projects & Research</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Government-funded, industry-sponsored, and internally funded research pushing the frontiers of robotics and AI</p>
                </motion.div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Projects', value: projects.length.toString() },
                        { label: 'Ongoing', value: projects.filter(p => p.status === 'ongoing').length.toString() },
                        { label: 'Publications', value: publications.length > 0 ? `${publications.length}+` : '—' },
                        { label: 'Domains', value: new Set(projects.map(p => p.domain)).size.toString() },
                    ].map(s => (
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
                {loadingR ? (
                    <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {projects.map((proj, i) => (
                            <motion.div key={proj._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`badge text-xs ${proj.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-300'}`}>
                                        {proj.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                                    </span>
                                    <span className="text-xs text-white/30">{proj.year}</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2 leading-snug flex-1">{proj.title}</h3>
                                <p className="text-sm text-white/50 mb-4 leading-relaxed">{proj.description}</p>
                                <div className="space-y-1.5 text-xs text-white/40 border-t border-white/5 pt-3">
                                    <div>🏛 {proj.fundingAgency} {proj.fundedAmount ? `· ${proj.fundedAmount}` : ''}</div>
                                    <div>👨‍🏫 {proj.facultyGuide}</div>
                                    <div>📂 {proj.domain}</div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/research/${proj._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-primary-500/10 text-white/40 hover:text-primary-300 transition-all text-xs">
                                        <FiExternalLink className="w-3.5 h-3.5" /> Details
                                    </Link>
                                    {proj.paperUrl && (
                                        <a href={proj.paperUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-cyber/10 text-white/40 hover:text-cyber transition-all text-xs">
                                            <FiDownload className="w-3.5 h-3.5" /> Paper
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {projects.length === 0 && !loadingR && (
                            <div className="col-span-3 text-center py-16 text-white/30 text-sm">
                                No research projects found. Check the admin dashboard.
                            </div>
                        )}
                    </div>
                )}

                {/* Publications */}
                <div id="publications">
                    <h2 className="section-title text-3xl text-white mb-6">📄 Selected Publications</h2>
                    {loadingP ? (
                        <div className="flex items-center justify-center py-10"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {publications.map((pub, i) => (
                                    <motion.div key={pub._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                                        className="glass-card p-5 flex items-start gap-4 hover:border-primary-500/30 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-300 font-bold text-sm flex-shrink-0">
                                            {((pubPage - 1) * 8) + i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white mb-1 leading-snug">{pub.title}</h3>
                                            <p className="text-sm text-accent-400 mb-1">{pub.journal}</p>
                                            <p className="text-xs text-white/40">{pub.authors} · {pub.year}</p>
                                        </div>
                                        {pub.downloadUrl && (
                                            <a href={pub.downloadUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-cyber transition-colors flex-shrink-0 py-2 px-3 rounded-lg bg-white/5 hover:bg-cyber/10">
                                                <FiDownload className="w-3.5 h-3.5" /> PDF
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                                {publications.length === 0 && !loadingP && (
                                    <div className="text-center py-10 text-white/30 text-sm glass-card">
                                        No publications added yet. Check the admin dashboard.
                                    </div>
                                )}
                            </div>
                            <Pagination page={pubPage} pages={pubPages} onPageChange={setPubPage} />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
