'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Faculty = {
    _id: string;
    name: string;
    designation: string;
    qualification: string;
    specialization: string;
    experience: number;
    email: string;
    phone?: string;
    photo?: string;
    researchAreas?: string[];
    publications?: { title: string; journal: string; year: number; link?: string }[];
    googleScholarLink?: string;
    linkedinLink?: string;
};

export default function FacultyProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [faculty, setFaculty] = useState<Faculty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/faculty/${id}`);
                const json = await res.json();
                if (json.success) setFaculty(json.data);
                else setError('Faculty member not found.');
            } catch {
                setError('Failed to load faculty profile.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
        </div>
    );

    if (error || !faculty) return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-white/40 gap-4">
            <div className="text-5xl">😕</div>
            <p>{error || 'Faculty not found.'}</p>
            <Link href="/faculty" className="btn-secondary text-sm">← Back to Faculty</Link>
        </div>
    );

    const initials = faculty.name.split(' ').map(n => n[0]).slice(0, 2).join('');

    return (
        <div className="min-h-screen pt-20">
            <section className="py-16 px-4 max-w-5xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Faculty', href: '/faculty' }, { label: faculty.name }]} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8 mb-10">
                    {/* Sidebar */}
                    <div className="glass-card p-6 text-center md:text-left">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto md:mx-0 mb-4">
                            {faculty.photo && faculty.photo !== '/images/default-avatar.png' ? (
                                <img src={faculty.photo} alt={faculty.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-700 to-accent-700 flex items-center justify-center text-3xl font-bold text-white">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <h1 className="font-display font-bold text-xl text-white mb-1">{faculty.name}</h1>
                        <p className="text-white/50 text-sm mb-2">{faculty.designation}</p>
                        <span className="badge bg-primary-500/20 text-primary-300 text-xs">{faculty.specialization}</span>

                        <div className="mt-5 space-y-3 text-sm text-white/50">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span>🎓</span><span>{faculty.qualification}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span>📅</span><span>{faculty.experience} years experience</span>
                            </div>
                            {faculty.phone && (
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <span>📞</span><span>{faculty.phone}</span>
                                </div>
                            )}
                            <a href={`mailto:${faculty.email}`}
                                className="flex items-center gap-2 justify-center md:justify-start hover:text-cyber transition-colors">
                                <FiMail className="w-4 h-4" /><span>{faculty.email}</span>
                            </a>
                        </div>

                        <div className="mt-5 flex gap-2 justify-center md:justify-start flex-wrap">
                            {faculty.googleScholarLink && (
                                <a href={faculty.googleScholarLink} target="_blank" rel="noopener noreferrer"
                                    className="badge bg-blue-500/20 text-blue-300 text-xs flex items-center gap-1">
                                    <FiExternalLink className="w-3 h-3" /> Google Scholar
                                </a>
                            )}
                            {faculty.linkedinLink && (
                                <a href={faculty.linkedinLink} target="_blank" rel="noopener noreferrer"
                                    className="badge bg-blue-700/20 text-blue-300 text-xs flex items-center gap-1">
                                    <FiExternalLink className="w-3 h-3" /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Research Areas */}
                        {faculty.researchAreas && faculty.researchAreas.length > 0 && (
                            <div className="glass-card p-6">
                                <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                                    🔬 Research Areas
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {faculty.researchAreas.map((area, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-cyber/10 border border-cyber/20 text-cyber text-sm">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Publications */}
                        {faculty.publications && faculty.publications.length > 0 && (
                            <div className="glass-card p-6">
                                <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                                    📄 Publications
                                </h2>
                                <div className="space-y-4">
                                    {faculty.publications.map((pub, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-cyber/20 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-300 font-bold text-sm flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white text-sm leading-snug mb-1">{pub.title}</h3>
                                                <p className="text-xs text-accent-400 mb-0.5">{pub.journal}</p>
                                                <p className="text-xs text-white/35">{pub.year}</p>
                                            </div>
                                            {pub.link && (
                                                <a href={pub.link} target="_blank" rel="noopener noreferrer"
                                                    className="text-white/30 hover:text-cyber transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <Link href="/faculty" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-cyber transition-colors">
                    <FiArrowLeft className="w-4 h-4" /> Back to Faculty Directory
                </Link>
            </section>
        </div>
    );
}
