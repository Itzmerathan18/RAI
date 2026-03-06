'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiCalendar, FiUser, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

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
    teamMembers?: string[];
    paperUrl?: string;
    thumbnail?: string;
};

export default function ResearchDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ResearchProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/research/${id}`);
                const json = await res.json();
                if (json.success) setProject(json.data);
                else setError('Project not found.');
            } catch { setError('Failed to load project.'); }
            finally { setLoading(false); }
        })();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
        </div>
    );

    if (error || !project) return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-white/40 gap-4">
            <div className="text-5xl">🔬</div>
            <p>{error || 'Project not found.'}</p>
            <Link href="/research" className="btn-secondary text-sm">← Back to Research</Link>
        </div>
    );

    return (
        <div className="min-h-screen pt-20">
            <section className="py-16 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Research', href: '/research' }, { label: project.title }]} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {project.thumbnail && (
                        <div className="w-full h-56 rounded-2xl overflow-hidden mb-8">
                            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`badge text-sm ${project.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-300'}`}>
                            {project.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                        </span>
                        <span className="badge bg-white/10 text-white/50 text-sm">{project.domain}</span>
                        <span className="text-white/30 text-sm">{project.year}</span>
                    </div>

                    <h1 className="section-title text-3xl text-white mb-6">{project.title}</h1>

                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 text-white/30 text-xs mb-1"><FiUser className="w-3 h-3" /> Faculty Guide</div>
                            <div className="text-white font-medium text-sm">{project.facultyGuide}</div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 text-white/30 text-xs mb-1"><FiZap className="w-3 h-3" /> Funding</div>
                            <div className="text-white font-medium text-sm">{project.fundingAgency}</div>
                            {project.fundedAmount && <div className="text-cyber text-xs mt-0.5">{project.fundedAmount}</div>}
                        </div>
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 text-white/30 text-xs mb-1"><FiCalendar className="w-3 h-3" /> Year</div>
                            <div className="text-white font-medium text-sm">{project.year}</div>
                        </div>
                    </div>

                    {project.description && (
                        <div className="glass-card p-6 mb-6">
                            <h2 className="font-display font-bold text-white mb-3">Project Description</h2>
                            <p className="text-white/55 leading-relaxed font-space">{project.description}</p>
                        </div>
                    )}

                    {project.teamMembers && project.teamMembers.length > 0 && (
                        <div className="glass-card p-6 mb-6">
                            <h2 className="font-display font-bold text-white mb-3">👥 Team Members</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.teamMembers.map((m, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        {project.paperUrl && (
                            <a href={project.paperUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                                <FiDownload /> Download Research Paper
                            </a>
                        )}
                        <Link href="/research" className="btn-secondary text-sm">
                            <FiArrowLeft className="w-4 h-4" /> Back to Research
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
