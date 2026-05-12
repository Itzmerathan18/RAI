'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiFilter } from 'react-icons/fi';
import { getEvents } from '@/lib/api';

const CATS = ['All', 'Workshop', 'Competition', 'Guest Lecture', 'Hackathon', 'Industrial Visit', 'Conference', 'Other'];

function formatDate(d: string | Date) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsPage() {
    const [cat, setCat] = useState('All');
    const [tab, setTab] = useState<'all' | 'upcoming'>('all');
    const [eventsData, setEventsData] = useState<any[]>([]);

    useEffect(() => {
        getEvents()
            .then(res => { if (res.data?.success && res.data?.data) setEventsData(res.data.data); })
            .catch(() => setEventsData([]));
    }, []);

    const filtered = eventsData.filter(e => {
        // Assume 'upcoming' can be derived from date or explicitly set (our schema has date)
        const isUpcoming = new Date(e.date) > new Date();
        return (cat === 'All' || e.category === cat) && (tab === 'all' || isUpcoming);
    });

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Events & Gallery</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Events & Activities</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Workshops, competitions, guest lectures, and student-driven hackathons</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
                    <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                        {(['all', 'upcoming'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-white/50 hover:text-white'}`}>
                                {t === 'all' ? 'All Events' : '🔜 Upcoming'}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <FiFilter className="text-white/30 self-center" />
                        {CATS.map(c => (
                            <button key={c} onClick={() => setCat(c)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${cat === c ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((ev, i) => (
                        <motion.div key={ev._id || ev.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card overflow-hidden hover:border-primary-500/40 transition-all duration-300">
                            <div className="h-32 bg-gradient-to-br from-primary-900/50 to-dark-800 flex items-center justify-center text-5xl">
                                {ev.emoji || '📅'}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`badge text-xs ${(ev.isUpcoming || new Date(ev.date) > new Date()) ? 'bg-accent-500/20 text-accent-400' : 'bg-white/10 text-white/50'}`}>
                                        {(ev.isUpcoming || new Date(ev.date) > new Date()) ? '🔜 Upcoming' : '✅ Completed'}
                                    </span>
                                    <span className="badge bg-primary-500/10 text-primary-300 text-xs">{ev.category}</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2 leading-snug">{ev.title}</h3>
                                <p className="text-sm text-white/50 mb-3 leading-relaxed">{ev.description || '—'}</p>
                                <div className="space-y-1 text-xs text-white/30">
                                    <div className="flex items-center gap-2"><FiCalendar className="text-primary-400" />{formatDate(ev.date)}</div>
                                    {ev.venue && <div className="flex items-center gap-2"><FiMapPin className="text-accent-400" />{ev.venue}</div>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        <div className="text-5xl mb-4">📅</div>
                        <p>No events found for this filter</p>
                    </div>
                )}
            </section>
        </div>
    );
}
