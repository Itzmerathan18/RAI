'use client';
import { motion } from 'framer-motion';
import { FiLinkedin, FiMail } from 'react-icons/fi';

const alumni = [
    { name: 'Arjun Hegde', batch: '2020-24', role: 'Robotics Engineer', org: 'ABB Robotics, Bengaluru', mentor: true, story: 'Started as an intern during 3rd year, converted to full-time Robotics Engineer. Working on collaborative robots for automotive assembly.' },
    { name: 'Sneha R.', batch: '2019-23', role: 'ML Engineer', org: 'Samsung R&D, Bengaluru', mentor: true, story: 'Research focuses on embedded AI for wearables. Published 2 papers at ICCV and contributed to open-source CV tools.' },
    { name: 'Kiran Patil', batch: '2018-22', role: 'Automation Engineer', org: 'Bosch India, Bengaluru', mentor: false, story: 'Specializes in industrial PLC automation and SCADA systems at Bosch India.' },
    { name: 'Divya Kumar', batch: '2019-23', role: 'AI Software Engineer', org: 'Infosys AI Lab, Pune', mentor: true, story: 'Working on NLP-based enterprise AI solutions. Leads a team of 6 engineers.' },
    { name: 'Rohit Singh', batch: '2020-24', role: 'Startup Founder', org: 'AgriBot AI (Self-Founded)', mentor: false, story: 'Founded AgriBot AI, an AI-powered crop monitoring startup incubated at JNNCE and now funded by BIRAC.' },
    { name: 'Meera Nair', batch: '2018-22', role: 'Control Systems Engineer', org: 'ISRO, Bengaluru', mentor: false, story: "Works on guidance and navigation systems at ISRO's Space Applications Centre." },
];

export default function AlumniPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Alumni Network</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Our Alumni</h1>
                    <p className="text-white/50 max-w-xl mx-auto">RAI graduates making an impact at ISRO, ABB, Samsung, Bosch, Infosys, and their own startups</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {alumni.map((a, i) => (
                        <motion.div key={a.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                            className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-xl font-bold text-white shadow-glow flex-shrink-0">
                                    {a.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white truncate">{a.name}</h3>
                                        {a.mentor && <span className="badge bg-accent-500/20 text-accent-400 text-xs flex-shrink-0">Mentor</span>}
                                    </div>
                                    <p className="text-sm text-primary-300">{a.role}</p>
                                    <p className="text-xs text-white/40">{a.org}</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/55 leading-relaxed mb-4 italic">&ldquo;{a.story}&rdquo;</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className="text-xs text-white/30">Batch {a.batch}</span>
                                <div className="flex gap-2">
                                    <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all"><FiLinkedin className="w-4 h-4" /></a>
                                    <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-white/40 hover:text-primary-400 transition-all"><FiMail className="w-4 h-4" /></a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mentorship program */}
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">🤝</div>
                    <h2 className="font-display font-bold text-2xl text-white mb-3">Join Our Mentorship Program</h2>
                    <p className="text-white/50 mb-6 max-w-lg mx-auto">Are you an RAI alumnus? Join our mentorship network and guide current students with your expertise and experience.</p>
                    <button className="btn-primary">Register as Mentor <FiMail /></button>
                </div>
            </section>
        </div>
    );
}
