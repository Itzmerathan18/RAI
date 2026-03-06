'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import Breadcrumb from '@/components/ui/Breadcrumb';

const CATS = ['All', 'Exam', 'Circular', 'Scholarship', 'Event', 'Admission', 'General', 'Holiday', 'Placement', 'Result'];

type Notice = {
    _id: string;
    title: string;
    description: string;
    category: string;
    important?: boolean;
    documentUrl?: string;
    date: string;
    isActive: boolean;
};

const catColors: Record<string, string> = {
    Exam: 'bg-red-500/20 text-red-300',
    Event: 'bg-blue-500/20 text-blue-300',
    Scholarship: 'bg-yellow-500/20 text-yellow-300',
    Circular: 'bg-purple-500/20 text-purple-300',
    Admission: 'bg-green-500/20 text-green-300',
    Holiday: 'bg-green-600/20 text-green-400',
    Placement: 'bg-orange-500/20 text-orange-300',
    Result: 'bg-pink-500/20 text-pink-300',
    General: 'bg-white/10 text-white/50',
};

export default function NoticesPage() {
    const [cat, setCat] = useState('All');
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/notices');
                const json = await res.json();
                setNotices((json.data || []).filter((n: Notice) => n.isActive));
            } catch { setNotices([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const filtered = notices.filter(n => cat === 'All' || n.category === cat);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Notices & Circulars' }]} />

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

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((n, i) => (
                            <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card p-5 hover:border-primary-500/30 transition-all group cursor-pointer flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`badge text-xs ${catColors[n.category] || catColors.General}`}>{n.category}</span>
                                        {n.important && <span className="badge bg-red-500/20 text-red-300 text-xs">⚠ Important</span>}
                                    </div>
                                    <h3 className="font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors leading-snug">{n.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{n.description}</p>
                                    <p className="text-xs text-white/25 mt-2">📅 {new Date(n.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                {n.documentUrl ? (
                                    <a href={n.documentUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-white/30 hover:text-cyber transition-colors flex-shrink-0 py-2 px-3 rounded-lg bg-white/5 hover:bg-cyber/10">
                                        <FiDownload className="w-3.5 h-3.5" /> PDF
                                    </a>
                                ) : (
                                    <FiArrowRight className="text-white/20 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
                                )}
                            </motion.div>
                        ))}
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-16 text-white/30 text-sm glass-card">
                                No notices in this category yet.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
