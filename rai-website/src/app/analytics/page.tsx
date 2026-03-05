'use client';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const chartOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#ffffff80' } } },
    scales: { x: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff08' } }, y: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff08' } } }
};

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Data Dashboard</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Analytics & Insights</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Transparent, data-driven view of department performance across placements, research, and academics</p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Avg Placement Rate', value: '83%', trend: '+7% YoY', icon: '📈' },
                        { label: 'Research Grants', value: '₹38.5L', trend: '+15% YoY', icon: '💼' },
                        { label: 'Publications (5yr)', value: '75+', trend: '+22 this year', icon: '📄' },
                        { label: 'Student Intake', value: '60/yr', trend: 'Consistent', icon: '🎓' },
                    ].map(k => (
                        <div key={k.label} className="glass-card p-6 text-center">
                            <div className="text-3xl mb-2">{k.icon}</div>
                            <div className="text-3xl font-display font-black gradient-text">{k.value}</div>
                            <div className="text-xs text-white/40 mt-1">{k.label}</div>
                            <div className="mt-2 text-xs text-accent-400 font-medium">{k.trend}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">📊 Placement Rate Trend (5 Years)</h3>
                        <Line data={{
                            labels: ['2020', '2021', '2022', '2023', '2024'],
                            datasets: [{ label: 'Placement %', data: [60, 67, 75, 83, 90], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, fill: true, pointRadius: 5 }]
                        }} options={chartOpts} />
                    </div>
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">📚 Research Publications Per Year</h3>
                        <Bar data={{
                            labels: ['2020', '2021', '2022', '2023', '2024'],
                            datasets: [{ label: 'Papers Published', data: [5, 9, 14, 22, 25], backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 }]
                        }} options={chartOpts} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">💰 Research Funding (₹ Lakhs)</h3>
                        <Bar data={{
                            labels: ['2020', '2021', '2022', '2023', '2024'],
                            datasets: [{ label: 'Grants Received (₹L)', data: [3, 5, 15, 8.5, 7], backgroundColor: 'rgba(251,191,36,0.7)', borderRadius: 6 }]
                        }} options={chartOpts} />
                    </div>
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-6">🏆 Department Scorecard</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Teaching Quality (NAAC)', value: 85 },
                                { label: 'Research Output', value: 78 },
                                { label: 'Industry Connect', value: 82 },
                                { label: 'Student Satisfaction', value: 90 },
                                { label: 'Lab Infrastructure', value: 88 },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-white/70">{item.label}</span>
                                        <span className="text-primary-300 font-semibold">{item.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
