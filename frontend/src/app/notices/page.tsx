'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getNotices } from '@/lib/api';

const CATS = ['All', 'Exam', 'Circular', 'Scholarship', 'Event', 'Admission', 'General', 'Holiday', 'Placement', 'Result'];

function formatDate(d: string | Date) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const catColors: Record<string, string> = {
    Exam: 'bg-red-500/20 text-red-300',
    Event: 'bg-blue-500/20 text-blue-300',
    Scholarship: 'bg-yellow-500/20 text-yellow-300',
    Circular: 'bg-purple-500/20 text-purple-300',
    Admission: 'bg-green-500/20 text-green-300',
};

export default function NoticesPage() {
    const [cat, setCat] = useState('All');
    const [noticesData, setNoticesData] = useState<any[]>([]);

    useEffect(() => {
        getNotices()
            .then(res => { if (res.data?.success && res.data?.data) setNoticesData(res.data.data); })
            .catch(() => setNoticesData([]));
    }, []);

    const filtered = noticesData.filter(n => cat === 'All' || n.category === cat);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Announcements</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Notices & Circulars</h1>
                    <p className="text-white/50">Stay updated with the latest announcements from the department</p>
                </motion.div>

                <div className="flex gap-2 flex-wrap mb-8 justify-center">
                    {CATS.map(c => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filtered.map((n, i) => (
                        <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="glass-card p-5 hover:border-primary-500/30 transition-all group cursor-pointer flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`badge text-xs ${catColors[n.category] || 'bg-white/10 text-white/50'}`}>{n.category}</span>
                                    {n.important && <span className="badge bg-accent-500/20 text-accent-400 text-xs">🆕 New</span>}
                                </div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors leading-snug">{n.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{n.description}</p>
                                <p className="text-xs text-white/25 mt-2">📅 {formatDate(n.date)}</p>
                            </div>
                            <FiArrowRight className="text-white/20 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
