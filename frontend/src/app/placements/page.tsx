'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const years = [2020, 2021, 2022, 2023, 2024];
const placed = [36, 40, 45, 50, 54];
const highest = [9, 10, 12, 15, 18];
const average = [5.5, 6.0, 6.5, 7.2, 8.5];

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

const companies2024 = ['Infosys', 'TCS', 'ABB', 'Bosch', 'Wipro', 'FANUC', 'Others'];
const companyCounts = [10, 8, 5, 4, 7, 3, 17];

export default function PlacementsPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-300 text-sm mb-5">Placements Dashboard</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Placement & Career</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Year-wise placement analytics, top recruiting companies, and package insights</p>
                </motion.div>

                {/* 2024 Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Placement Rate', value: '90%', icon: '📈', color: 'text-accent-400' },
                        { label: 'Highest Package', value: '18 LPA', icon: '💰', color: 'text-yellow-400' },
                        { label: 'Average Package', value: '8.5 LPA', icon: '📊', color: 'text-primary-400' },
                        { label: 'Internships', value: '48', icon: '🏢', color: 'text-blue-400' },
                    ].map(stat => (
                        <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 text-center hover:border-primary-500/30 transition-all">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className={`text-3xl font-display font-black ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-xs text-white/40">{stat.label} · 2024</div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card p-6">
                        <h2 className="font-semibold text-white mb-6">📊 Year-wise Placement (Students Placed)</h2>
                        <Bar data={{
                            labels: years.map(String),
                            datasets: [
                                { label: 'Students Placed', data: placed, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
                                { label: 'Total Strength', data: [60, 60, 60, 60, 60], backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6 },
                            ]
                        }} options={chartOptions} />
                    </div>
                    <div className="glass-card p-6">
                        <h2 className="font-semibold text-white mb-6">💹 Package Trends (LPA)</h2>
                        <Line data={{
                            labels: years.map(String),
                            datasets: [
                                { label: 'Highest Package', data: highest, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', tension: 0.4, pointRadius: 5 },
                                { label: 'Average Package', data: average, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, pointRadius: 5 },
                            ]
                        }} options={chartOptions} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <div className="glass-card p-6">
                        <h2 className="font-semibold text-white mb-6">🏢 Recruiter Share – 2024</h2>
                        <Pie data={{
                            labels: companies2024,
                            datasets: [{ data: companyCounts, backgroundColor: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'], borderWidth: 0 }]
                        }} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#ffffff70', font: { size: 11 } } } } }} />
                    </div>

                    <div className="lg:col-span-2 glass-card p-6">
                        <h2 className="font-semibold text-white mb-6">📋 Year-wise Summary</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full data-table">
                                <thead>
                                    <tr>
                                        <th>Year</th><th>Total</th><th>Placed</th><th>Rate</th><th>Highest (LPA)</th><th>Avg (LPA)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years.reverse().map((yr, i) => (
                                        <tr key={yr}>
                                            <td className="text-white/80 font-medium">{yr}</td>
                                            <td className="text-white/60">60</td>
                                            <td className="text-white/60">{placed.slice().reverse()[i]}</td>
                                            <td><span className="badge bg-accent-500/20 text-accent-400 text-xs">{Math.round((placed.slice().reverse()[i] / 60) * 100)}%</span></td>
                                            <td className="text-yellow-400 font-semibold">{highest.slice().reverse()[i]}</td>
                                            <td className="text-primary-400 font-semibold">{average.slice().reverse()[i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Top Recruiters */}
                <div className="glass-card p-8">
                    <h2 className="font-semibold text-white mb-6 text-xl">🏭 Our Recruiting Partners</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {['ABB Robotics', 'Bosch', 'Siemens', 'Infosys', 'TCS', 'Wipro', 'FANUC', 'L&T', 'HCL', 'Cognizant', 'Samsung', 'Capgemini'].map(c => (
                            <div key={c} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/60 hover:text-white hover:bg-primary-500/10 hover:border-primary-500/30 transition-all">
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
