'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiArrowLeft, FiImage } from 'react-icons/fi';
import Link from 'next/link';

// Simple types matching admin panel
type EventData = {
    id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    description: string;
    images?: string[]; // Adding images for the gallery view
};

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        // Read from localStorage for now to sync with admin panel data
        const events: EventData[] = JSON.parse(localStorage.getItem('admin_events') || '[]');
        const found = events.find(e => e.id === params.id) || null;
        setEvent(found);
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="p-4 mx-auto w-12 h-12 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin mb-4" />
                <p className="text-[var(--text-muted)]">Loading event details...</p>
                <Link href="/gallery" className="mt-6 btn-secondary text-sm"><FiArrowLeft /> Back to Gallery</Link>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                <p className="text-[var(--text-muted)] mb-4">Event not found. Please check the Admin Portal gallery/events data.</p>
                <Link href="/gallery" className="btn-secondary text-sm"><FiArrowLeft /> Back to Gallery</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            <Link href="/gallery" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--cyber)] mb-8 transition-colors">
                <FiArrowLeft /> Back to Gallery Directory
            </Link>

            {/* Event Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-10 overflow-hidden relative">
                {/* Background flare */}
                <div className="orb w-96 h-96 bg-[var(--cyber)] opacity-[0.03] -top-48 -right-48 pointer-events-none" />

                <span className="badge bg-cyber/15 text-cyber border border-cyber/20 text-sm mb-4">
                    {event.category}
                </span>

                <h1 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] mb-4">
                    {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)] text-sm md:text-base mb-6">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-cyber" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {event.venue && (
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-cyber" />
                            <span>{event.venue}</span>
                        </div>
                    )}
                </div>

                <p className="text-[var(--text-muted)] leading-relaxed max-w-4xl text-lg">
                    {event.description}
                </p>
            </motion.div>

            {/* Photos Grid */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-6">
                    <FiImage className="text-2xl text-cyber" />
                    <h2 className="font-orbitron font-bold text-2xl text-[var(--text)]">Event Gallery</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.images && event.images.length > 0 ? event.images.map((img, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass-card aspect-video border border-[var(--border)] overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${event.title} photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    // Fallback for placeholder images if they don't exist
                                    (e.target as HTMLImageElement).src = '/images/jnnce-campus.jpeg';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="btn-primary py-2 px-4">View Photo</span>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 glass-card">
                            <FiImage className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-30" />
                            <p className="text-[var(--text-muted)]">No images have been uploaded for this event yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Lightbox for large image viewing */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8" onClick={() => setSelectedImage(null)}>
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Enlarged gallery view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10 shadow-2xl"
                        onClick={e => e.stopPropagation()} // Prevent clicking image from closing lightbox
                    />
                </div>
            )}
        </div>
    );
}
