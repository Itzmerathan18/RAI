'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Breadcrumb from '@/components/ui/Breadcrumb';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

type PlacementRecord = {
    _id: string;
    year: number;
    placed: number;
    total: number;
    highest: number;
    average: number;
    companies: string[] | string;
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { labels: { color: '#ffffff80', font: { size: 12 } } },
        title: { display: false }
    },
    scales: {
        x: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff08' } },
        y: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff08' } }
    }
};

export default function PlacementsPage() {
    const [records, setRecords] = useState<PlacementRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/placements');
                const json = await res.json();
                setRecords((json.data || []).sort((a: PlacementRecord, b: PlacementRecord) => b.year - a.year));
            } catch { setRecords([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const getCompanies = (c: string[] | string): string[] =>
        Array.isArray(c) ? c : c ? c.split(',').map(s => s.trim()).filter(Boolean) : [];

    // Latest record for highlights
    const latest = records[0];
    const sorted = [...records].sort((a, b) => a.year - b.year);
    const years = sorted.map(r => String(r.year));
    const placed = sorted.map(r => r.placed);
    const highest = sorted.map(r => r.highest);
    const average = sorted.map(r => r.average);

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: 'Placements' }]} />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-300 text-sm mb-5">Placements Dashboard</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Placement & Career</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Year-wise placement analytics, top recruiting companies, and package insights</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-20 text-white/30 text-sm glass-card">
                        No placement records added yet. Add some from the admin dashboard.
                    </div>
                ) : (
                    <>
                        {/* Latest Year Highlights */}
                        {latest && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {[
                                    { label: 'Placement Rate', value: `${Math.round((latest.placed / latest.total) * 100)}%`, icon: '📈', color: 'text-accent-400' },
                                    { label: 'Highest Package', value: `${latest.highest} LPA`, icon: '💰', color: 'text-yellow-400' },
                                    { label: 'Average Package', value: `${latest.average} LPA`, icon: '📊', color: 'text-primary-400' },
                                    { label: 'Students Placed', value: `${latest.placed}/${latest.total}`, icon: '🎓', color: 'text-blue-400' },
                                ].map(stat => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-6 text-center hover:border-primary-500/30 transition-all">
                                        <div className="text-3xl mb-2">{stat.icon}</div>
                                        <div className={`text-3xl font-display font-black ${stat.color} mb-1`}>{stat.value}</div>
                                        <div className="text-xs text-white/40">{stat.label} · {latest.year}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Charts */}
                        {years.length > 1 && (
                            <div className="grid lg:grid-cols-2 gap-8 mb-12">
                                <div className="glass-card p-6">
                                    <h2 className="font-semibold text-white mb-6">📊 Year-wise Placement</h2>
                                    <Bar data={{
                                        labels: years,
                                        datasets: [
                                            { label: 'Students Placed', data: placed, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
                                        ]
                                    }} options={chartOptions} />
                                </div>
                                <div className="glass-card p-6">
                                    <h2 className="font-semibold text-white mb-6">💹 Package Trends (LPA)</h2>
                                    <Line data={{
                                        labels: years,
                                        datasets: [
                                            { label: 'Highest Package', data: highest, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', tension: 0.4, pointRadius: 5 },
                                            { label: 'Average Package', data: average, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, pointRadius: 5 },
                                        ]
                                    }} options={chartOptions} />
                                </div>
                            </div>
                        )}

                        {/* Year-wise Table */}
                        <div className="glass-card p-6 mb-12">
                            <h2 className="font-semibold text-white mb-6">📋 Year-wise Summary</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            {['Year', 'Total', 'Placed', 'Rate', 'Highest (LPA)', 'Avg (LPA)', 'Top Companies'].map(h => (
                                                <th key={h} className="text-left p-3 text-white/40 font-medium whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map(p => (
                                            <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                                <td className="p-3 font-bold text-white">{p.year}</td>
                                                <td className="p-3 text-white/55">{p.total}</td>
                                                <td className="p-3 text-white/55">{p.placed}</td>
                                                <td className="p-3"><span className="badge bg-accent-500/20 text-accent-400 text-xs">{Math.round((p.placed / p.total) * 100)}%</span></td>
                                                <td className="p-3 text-yellow-400 font-semibold">{p.highest} LPA</td>
                                                <td className="p-3 text-primary-400 font-semibold">{p.average} LPA</td>
                                                <td className="p-3 text-white/40 max-w-[200px] truncate">{getCompanies(p.companies).join(', ')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Recruiters (combined from all years) */}
                        {(() => {
                            const allCompanies = [...new Set(records.flatMap(r => getCompanies(r.companies)))];
                            return allCompanies.length > 0 ? (
                                <div className="glass-card p-8">
                                    <h2 className="font-semibold text-white mb-6 text-xl">🏭 Our Recruiting Partners</h2>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                        {allCompanies.map(c => (
                                            <div key={c} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/60 hover:text-white hover:bg-primary-500/10 hover:border-primary-500/30 transition-all">
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </>
                )}
            </section>
        </div>
    );
}
