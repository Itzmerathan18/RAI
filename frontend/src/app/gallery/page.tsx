'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const CATEGORIES = ['All', 'Events'];

interface GalleryItem {
    id: string | number;
    category: string;
    title: string;
    emoji: string;
    desc: string;
    img?: string;  // real photo path if available
    isEvent?: boolean;
}

const galleryItems: GalleryItem[] = [];

const emojiColors: Record<string, string> = {
    Labs: 'from-cyan-900/50 to-cyan-950',
    Events: 'from-blue-900/50 to-blue-950',
    Department: 'from-indigo-900/50 to-indigo-950',
    Competitions: 'from-red-900/40 to-red-950',
    Students: 'from-green-900/40 to-green-950',
};

export default function GalleryPage() {
    const [active, setActive] = useState('All');
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
    const [adminEvents, setAdminEvents] = useState<any[]>([]);

    useEffect(() => {
        // Load real events from the CMS (localStorage mock)
        const stored = JSON.parse(localStorage.getItem('admin_events') || '[]');
        setAdminEvents(stored);
    }, []);

    const dynamicItems: GalleryItem[] = adminEvents.map(e => ({
        id: e.id,
        category: e.category || 'Events',
        title: e.title,
        emoji: '📅',
        desc: `${e.date ? `📅 ${e.date} — ` : ''}${e.description}`,
        isEvent: true,
    }));

    const combinedItems = [...galleryItems, ...dynamicItems];

    const filtered = active === 'All' ? combinedItems : combinedItems.filter(g => g.category === active);

    return (
        <div className="min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                    Photo Gallery
                </div>
                <h1 className="section-title text-3xl text-white mb-3">
                    Life at <span className="gradient-text-static">RAI · JNNCE</span>
                </h1>
                <p className="text-white/35 text-sm font-space">Events managed entirely through the Admin Portal</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActive(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-orbitron uppercase tracking-wider transition-all ${active === cat
                            ? 'bg-cyber text-black border border-cyber shadow-glow'
                            : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
                            }`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filtered.map(item => (
                        <motion.div key={item.id} layout
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                            onClick={() => !item.isEvent && setLightbox(item)}
                            className="group flex flex-col glass-card overflow-hidden border border-[var(--border)] hover:border-[var(--cyber)] hover:shadow-[0_0_15px_var(--cyber-glow)] transition-all duration-300"
                        >
                            {/* Visual — real photo or emoji placeholder */}
                            <div className={`w-full aspect-[4/3] relative overflow-hidden ${!item.img ? `bg-[var(--card-bg)] flex items-center justify-center` : ''}`}>
                                {item.img ? (
                                    <img src={item.img} alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 cyber-grid opacity-10" />
                                        <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                                    </>
                                )}

                                {/* Overlay action button (Zoom for photos, Link for events) */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    {item.isEvent ? (
                                        <Link href={`/gallery/${item.id}`} className="btn-primary py-2 px-5 text-sm shadow-xl">
                                            View Event <FiArrowRight className="inline ml-1" />
                                        </Link>
                                    ) : (
                                        <div className="btn-secondary py-2 px-5 text-sm cursor-pointer shadow-xl border-white/30 text-white bg-white/10" onClick={() => setLightbox(item)}>
                                            <FiZoomIn className="inline mr-1" /> View Image
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="badge bg-[var(--cyber)]/15 text-[var(--cyber)] border border-[var(--cyber)]/20 text-xs py-0.5 px-2">
                                        {item.category}
                                    </span>
                                </div>
                                <h3 className="text-sm font-orbitron text-[var(--text)] font-bold leading-tight mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--text-muted)] text-xs line-clamp-2 mt-auto">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-white/20 text-sm font-space">No items in this category yet.</div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setLightbox(null)}>
                        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.2 }}
                            className="glass-card-cyan max-w-lg w-full p-0 overflow-hidden border border-cyber/25 shadow-glow-lg"
                            onClick={e => e.stopPropagation()}>
                            {/* Hero area — real photo or emoji */}
                            <div className={`w-full h-56 relative overflow-hidden ${!lightbox.img ? `bg-gradient-to-br ${emojiColors[lightbox.category] || 'from-gray-900 to-black'} flex items-center justify-center` : ''}`}>
                                {lightbox.img ? (
                                    <img src={lightbox.img} alt={lightbox.title}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 cyber-grid opacity-30" />
                                        <span className="text-8xl relative z-10">{lightbox.emoji}</span>
                                    </>
                                )}
                            </div>
                            {/* Info */}
                            <div className="p-6">
                                <span className="badge-cyber badge text-xs mb-3">{lightbox.category}</span>
                                <h2 className="font-orbitron font-bold text-white text-lg mb-2">{lightbox.title}</h2>
                                <p className="text-white/50 text-sm leading-relaxed font-space">{lightbox.desc}</p>
                                <button onClick={() => setLightbox(null)}
                                    className="mt-5 btn-secondary w-full justify-center text-sm">
                                    <FiX /> Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
