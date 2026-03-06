'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiGlobe } from 'react-icons/fi';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Alumni = {
    _id: string;
    name: string;
    batch: string;
    currentCompany?: string;
    designation?: string;
    location?: string;
    linkedInUrl?: string;
    photo?: string;
    message?: string;
};

export default function AlumniPage() {
    const [data, setData] = useState<Alumni[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/alumni');
                const json = await res.json();
                setData(json.data || []);
            } catch { setData([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Alumni' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Our Network</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Alumni</h1>
                    <p className="text-white/50 max-w-xl mx-auto">RAI alumni making an impact across the industry and academia worldwide</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.map((alum, i) => (
                            <motion.div key={alum._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card p-5 hover:border-primary-500/30 transition-all text-center group">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3">
                                    {alum.photo ? (
                                        <img src={alum.photo} alt={alum.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary-700 to-accent-700 flex items-center justify-center text-xl font-bold text-white">
                                            {getInitials(alum.name)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-white text-sm mb-0.5">{alum.name}</h3>
                                {alum.batch && <p className="text-xs text-primary-300 mb-1">Batch {alum.batch}</p>}
                                {alum.designation && <p className="text-xs text-white/50">{alum.designation}</p>}
                                {alum.currentCompany && <p className="text-xs text-accent-400 mt-0.5">{alum.currentCompany}</p>}
                                {alum.location && <p className="text-xs text-white/30 mt-1">📍 {alum.location}</p>}
                                {alum.message && (
                                    <p className="text-xs text-white/40 italic mt-3 border-t border-white/5 pt-3 leading-relaxed line-clamp-3">"{alum.message}"</p>
                                )}
                                {alum.linkedInUrl && (
                                    <a href={alum.linkedInUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                        <FiLinkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                            </motion.div>
                        ))}
                        {data.length === 0 && !loading && (
                            <div className="col-span-4 text-center py-16 text-white/30 text-sm glass-card">
                                No alumni profiles added yet. Add some from the admin dashboard.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
