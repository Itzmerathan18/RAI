'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Achievement = {
    _id: string;
    studentName: string;
    achievementTitle: string;
    eventName: string;
    awardRank: string;
    year: number;
};

export default function AchievementsPage() {
    const [data, setData] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState<number | 'All'>('All');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/achievements');
                const json = await res.json();
                setData(json.data || []);
            } catch { setData([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const years = Array.from(new Set(data.map(a => a.year))).sort((a, b) => b - a);
    const filtered = yearFilter === 'All' ? data : data.filter(a => a.year === yearFilter);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-5xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Achievements' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-300 text-sm mb-5">Student Success</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Achievements</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Celebrating the accomplishments of our students in competitions, events, and beyond</p>
                </motion.div>

                {/* Year filter */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {(['All', ...years] as (number | 'All')[]).map(y => (
                        <button key={y} onClick={() => setYearFilter(y)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearFilter === y ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {y}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filtered.map((a, i) => (
                            <motion.div key={a._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card p-5 hover:border-accent-500/30 transition-all hover:shadow-glow">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-xl flex-shrink-0">🏆</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white text-sm mb-1">{a.achievementTitle}</h3>
                                        <p className="text-sm text-accent-300 font-medium">{a.studentName}</p>
                                        {a.eventName && <p className="text-xs text-white/40 mt-1">📍 {a.eventName}</p>}
                                        <div className="flex items-center gap-2 mt-2">
                                            {a.awardRank && <span className="badge bg-cyber/20 text-cyber text-xs">{a.awardRank}</span>}
                                            <span className="text-xs text-white/30">{a.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && !loading && (
                            <div className="col-span-2 text-center py-16 text-white/30 text-sm glass-card">
                                No achievements recorded yet. Add some from the admin dashboard.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
