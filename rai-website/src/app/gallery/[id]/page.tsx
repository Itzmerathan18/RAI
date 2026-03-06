'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

type GalleryEvent = {
    _id: string;
    title: string;
    category: string;
    status: string;
    description: string;
    thumbnail?: string;
    images?: string[];
    videos?: string[];
    date?: string;
    eventDuration?: string;
    results?: string;
};

export default function GalleryEventPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<GalleryEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/gallery/${id}`);
                const json = await res.json();
                if (json.success) setEvent(json.data);
                else setError('Event not found.');
            } catch { setError('Failed to load event.'); }
            finally { setLoading(false); }
        })();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4 text-white/40">
            <div className="text-5xl">🖼</div>
            <p>{error || 'Event not found.'}</p>
            <Link href="/gallery" className="btn-secondary text-sm">← Back to Gallery</Link>
        </div>
    );

    const allImages = event.images || [];

    return (
        <div className="min-h-screen pt-20">
            <section className="py-16 px-4 max-w-6xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Gallery', href: '/gallery' }, { label: event.title }]} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="badge bg-cyber/15 text-cyber border border-cyber/20 text-sm">{event.category}</span>
                        <span className={`badge text-sm ${event.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-white/10 text-white/50'}`}>
                            {event.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                        </span>
                        {event.date && (
                            <span className="text-white/30 text-sm flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5" /> {event.date}
                                {event.eventDuration && ` · ${event.eventDuration}`}
                            </span>
                        )}
                    </div>
                    <h1 className="section-title text-3xl text-white mb-4">{event.title}</h1>
                    {event.description && <p className="text-white/55 font-space leading-relaxed mb-8">{event.description}</p>}

                    {/* Thumbnail */}
                    {event.thumbnail && (
                        <div className="w-full h-72 rounded-2xl overflow-hidden mb-8 cursor-pointer" onClick={() => setLightbox(event.thumbnail!)}>
                            <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}

                    {/* Image Gallery Grid */}
                    {allImages.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-display font-bold text-white mb-4">📸 Photos ({allImages.length})</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {allImages.map((img, i) => (
                                    <motion.div key={i} whileHover={{ scale: 1.03 }}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-cyber/30 transition-all"
                                        onClick={() => setLightbox(img)}>
                                        <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos */}
                    {event.videos && event.videos.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-display font-bold text-white mb-4">🎬 Videos</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {event.videos.map((v, i) => (
                                    <video key={i} controls className="w-full rounded-xl border border-white/10" preload="metadata">
                                        <source src={v} />
                                    </video>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {event.results && (
                        <div className="glass-card p-6 mb-8">
                            <h2 className="font-display font-bold text-white mb-3">🏆 Results</h2>
                            <p className="text-white/55 font-space leading-relaxed">{event.results}</p>
                        </div>
                    )}

                    <Link href="/gallery" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-cyber transition-colors">
                        <FiArrowLeft className="w-4 h-4" /> Back to Gallery
                    </Link>
                </motion.div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setLightbox(null)}>
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                            className="relative max-w-4xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
                            <img src={lightbox} alt="Full size" className="w-full h-full object-contain rounded-2xl" />
                            <button onClick={() => setLightbox(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                                <FiX />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
