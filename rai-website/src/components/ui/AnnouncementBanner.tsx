'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiRadio } from 'react-icons/fi';

// Banners are stored in localStorage (admin-managed) or fetched from API
// For now, admin can add banners as localStorage entries under key 'rai_banners'
interface Banner {
    id: string;
    text: string;
    type: 'info' | 'warning' | 'event';
    link?: string;
}

const typeStyles = {
    info: 'bg-cyber/10 border-cyber/20 text-cyber',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    event: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
};

export default function AnnouncementBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('rai_banners') || '[]');
            setBanners(stored.filter((b: Banner) => b.text?.trim()));
        } catch { /* no-op */ }
    }, []);

    if (dismissed || banners.length === 0) return null;

    const banner = banners[current];
    if (!banner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                className={`fixed top-16 left-0 right-0 z-40 border-b backdrop-blur-SM ${typeStyles[banner.type]}`}
            >
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
                    <FiRadio className="w-4 h-4 flex-shrink-0 animate-pulse" />
                    <span className="flex-1 text-sm font-space text-center">
                        {banner.link ? (
                            <a href={banner.link} className="hover:underline">{banner.text}</a>
                        ) : banner.text}
                        {banners.length > 1 && (
                            <span className="ml-2 text-xs opacity-50">({current + 1}/{banners.length})</span>
                        )}
                    </span>
                    {banners.length > 1 && (
                        <button
                            onClick={() => setCurrent((current + 1) % banners.length)}
                            className="text-xs opacity-50 hover:opacity-100 transition-opacity px-2"
                        >
                            Next →
                        </button>
                    )}
                    <button
                        onClick={() => setDismissed(true)}
                        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Dismiss banner"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
