'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Lab = {
    _id: string;
    name: string;
    description: string;
    equipment: string[];
    images: string[];
};

export default function LabsPage() {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/labs');
                const json = await res.json();
                setLabs(json.data || []);
            } catch { setLabs([]); }
            finally { setLoading(false); }
        })();
    }, []);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-6xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Laboratories' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-cyber/10 border border-cyber/30 text-cyber text-sm mb-5">Infrastructure</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Laboratories</h1>
                    <p className="text-white/50 max-w-xl mx-auto">State-of-the-art facilities empowering research, experimentation, and hands-on learning</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {labs.map((lab, i) => (
                            <motion.div key={lab._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className="glass-card overflow-hidden hover:border-cyber/30 transition-all">
                                {/* Header */}
                                <div className="p-6 flex items-start justify-between gap-4 cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === lab._id ? null : lab._id)}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyber/10 border border-cyber/20 flex items-center justify-center text-2xl flex-shrink-0">🔬</div>
                                        <div>
                                            <h2 className="font-display font-bold text-white text-lg">{lab.name}</h2>
                                            <p className="text-sm text-white/50 mt-1 leading-relaxed max-w-2xl">{lab.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-white/30 text-xs flex-shrink-0 mt-1">
                                        {expandedId === lab._id ? '▲ Collapse' : '▼ Equipment'}
                                    </div>
                                </div>

                                {/* Images row */}
                                {lab.images?.length > 0 && (
                                    <div className="px-6 pb-4 flex gap-3 overflow-x-auto scrollbar-thin">
                                        {lab.images.map((img, j) => (
                                            <img key={j} src={img} alt={`${lab.name} ${j + 1}`}
                                                className="w-32 h-24 object-cover rounded-xl flex-shrink-0 border border-white/10" />
                                        ))}
                                    </div>
                                )}

                                {/* Equipment list (expandable) */}
                                {expandedId === lab._id && lab.equipment?.length > 0 && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Equipment & Resources</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {lab.equipment.map((eq, j) => (
                                                <span key={j} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:border-cyber/30 hover:text-cyber transition-all">
                                                    {eq}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                        {labs.length === 0 && !loading && (
                            <div className="text-center py-20 text-white/30 text-sm glass-card">
                                No lab profiles added yet. Add some from the admin dashboard.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
