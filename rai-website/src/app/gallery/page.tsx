'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiZoomIn, FiArrowRight, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

const CATS = ['All', 'Events', 'Competitions', 'Cultural', 'Projects', 'Industrial Visits', 'Students', 'Workshops', 'Laboratories', 'College Events'];

type GalleryEvent = {
    _id: string;
    title: string;
    category: string;
    status: string;
    description: string;
    thumbnail?: string;
    images?: string[];
    date?: string;
    eventDuration?: string;
};

export default function GalleryPage() {
    const [active, setActive] = useState('All');
    const [events, setEvents] = useState<GalleryEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const params = new URLSearchParams();
                if (active !== 'All') params.set('category', active);
                const res = await fetch(`/api/gallery?${params}`);
                const json = await res.json();
                setEvents(json.data || []);
            } catch { setEvents([]); }
            finally { setLoading(false); }
        })();
    }, [active]);

    return (
        <div className="min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Breadcrumb items={[{ label: 'Gallery' }]} />

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                    Photo Gallery
                </div>
                <h1 className="section-title text-3xl text-white mb-3">
                    Life at <span className="gradient-text-static">RAI · JNNCE</span>
                </h1>
                <p className="text-white/35 text-sm font-space">Events, workshops, competitions, and more</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATS.map(cat => (
                    <button key={cat} onClick={() => { setActive(cat); setLoading(true); }}
                        className={`px-4 py-2 rounded-full text-xs font-orbitron uppercase tracking-wider transition-all ${active === cat
                            ? 'bg-cyber text-black border border-cyber shadow-glow'
                            : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
                            }`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                </div>
            )}

            {/* Grid */}
            {!loading && (
                <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {events.map(item => (
                            <motion.div key={item._id} layout
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                                className="group flex flex-col glass-card overflow-hidden border border-[var(--border)] hover:border-[var(--cyber)] hover:shadow-[0_0_15px_var(--cyber-glow)] transition-all duration-300">

                                {/* Thumbnail */}
                                <div className="w-full aspect-[4/3] relative overflow-hidden">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-black flex items-center justify-center">
                                            <div className="absolute inset-0 cyber-grid opacity-10" />
                                            <span className="text-5xl relative z-10">📅</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <Link href={`/gallery/${item._id}`} className="btn-primary py-2 px-5 text-sm shadow-xl">
                                            View Event <FiArrowRight className="inline ml-1" />
                                        </Link>
                                    </div>
                                    {/* Status badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`badge text-xs ${item.status === 'ongoing' ? 'bg-accent-500/80 text-black' : 'bg-black/60 text-white/60'}`}>
                                            {item.status === 'ongoing' ? '🟢 Ongoing' : '✅ Done'}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="badge bg-[var(--cyber)]/15 text-[var(--cyber)] border border-[var(--cyber)]/20 text-xs py-0.5 px-2">
                                            {item.category}
                                        </span>
                                        {item.date && (
                                            <span className="text-white/30 text-xs flex items-center gap-0.5">
                                                <FiCalendar className="w-3 h-3" /> {item.date}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-orbitron text-[var(--text)] font-bold leading-tight mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-xs line-clamp-2 mt-auto">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && events.length === 0 && (
                <div className="text-center py-20 text-white/20 text-sm font-space">
                    No gallery events in this category yet. Add some from the admin dashboard.
                </div>
            )}
        </div>
    );
}
