'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiSearch, FiBook, FiFileText, FiYoutube, FiGithub } from 'react-icons/fi';

const semesters = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
const types = ['All', 'Notes', 'Lab Manual', 'Question Papers', 'PPT', 'Video'];

const resources = [
    { title: 'Mathematics for AI & Robotics – Notes', sem: 'Sem 3', type: 'Notes', icon: <FiBook />, size: '4.2 MB' },
    { title: 'ROS Programming Lab Manual', sem: 'Sem 5', type: 'Lab Manual', icon: <FiFileText />, size: '8.1 MB' },
    { title: 'Control Systems VTU Question Papers (2019–2023)', sem: 'Sem 4', type: 'Question Papers', icon: <FiFileText />, size: '3.5 MB' },
    { title: 'Introduction to Deep Learning – PPT', sem: 'Sem 6', type: 'PPT', icon: <FiBook />, size: '2.8 MB' },
    { title: 'Embedded Systems Design Notes', sem: 'Sem 5', type: 'Notes', icon: <FiBook />, size: '5.5 MB' },
    { title: 'Mechatronics Lab Manual', sem: 'Sem 6', type: 'Lab Manual', icon: <FiFileText />, size: '6.3 MB' },
    { title: 'Computer Vision with OpenCV – Video Series', sem: 'Sem 6', type: 'Video', icon: <FiYoutube />, size: 'YouTube' },
    { title: 'AI/ML Project Code Repository', sem: 'Sem 7', type: 'Notes', icon: <FiGithub />, size: 'GitHub' },
    { title: 'Robotics Engineering – VTU QP 2022-23', sem: 'Sem 7', type: 'Question Papers', icon: <FiFileText />, size: '2.1 MB' },
];

export default function ResourcesPage() {
    const [sem, setSem] = useState('All');
    const [type, setType] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = resources.filter(r =>
        (sem === 'All' || r.sem === sem) &&
        (type === 'All' || r.type === type) &&
        r.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Academic Resources</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Study Resources</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Notes, lab manuals, question papers, PPTs, and video lectures — all in one place</p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-6">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search resources by title…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {semesters.map(s => (
                        <button key={s} onClick={() => setSem(s)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${sem === s ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                    {types.map(t => (
                        <button key={t} onClick={() => setType(t)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${type === t ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Resource</th><th>Semester</th><th>Type</th><th>Size</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <span className="text-primary-400">{r.icon}</span>
                                            <span className="text-white/80 font-medium">{r.title}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-primary-500/15 text-primary-300 text-xs">{r.sem}</span></td>
                                    <td><span className="badge bg-white/10 text-white/50 text-xs">{r.type}</span></td>
                                    <td className="text-white/40 text-sm">{r.size}</td>
                                    <td>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 transition-all text-sm">
                                            <FiDownload className="w-3.5 h-3.5" /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-white/30">
                            <div className="text-4xl mb-3">📂</div>
                            <p>No resources found</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
