'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiYoutube, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        toast.success('Message sent! We will get back to you within 2 working days.');
        setForm({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Get in Touch</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Contact Us</h1>
                    <p className="text-white/50 max-w-xl mx-auto">Reach out for admissions, research collaborations, industry partnerships or any queries about the RAI department.</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <div className="glass-card p-8">
                            <h2 className="font-display font-bold text-xl text-white mb-6">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/50 mb-1.5 block">Your Name *</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            required placeholder="Your full name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/50 mb-1.5 block">Email Address *</label>
                                        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            required type="email" placeholder="you@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-white/50 mb-1.5 block">Subject *</label>
                                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                        required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/60 transition-colors">
                                        <option value="" className="bg-dark-900">Select a subject…</option>
                                        <option value="Admission Inquiry" className="bg-dark-900">Admission Inquiry</option>
                                        <option value="Research Collaboration" className="bg-dark-900">Research Collaboration</option>
                                        <option value="Industry Partnership" className="bg-dark-900">Industry Partnership / MoU</option>
                                        <option value="Faculty Query" className="bg-dark-900">Faculty Query</option>
                                        <option value="Alumni Connect" className="bg-dark-900">Alumni Connect</option>
                                        <option value="Other" className="bg-dark-900">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-white/50 mb-1.5 block">Message *</label>
                                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                        required rows={5} placeholder="Your message…"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors resize-none" />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="btn-primary w-full justify-center disabled:opacity-50">
                                    {loading ? (
                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</span>
                                    ) : <><FiSend /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-5">
                        {/* Real contact info */}
                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-white mb-5">Department Contact</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="text-primary-400 w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/30 mb-0.5 uppercase tracking-wider">Address</div>
                                        <div className="text-sm text-white/65 leading-relaxed">
                                            Dept. of Robotics & Artificial Intelligence<br />
                                            JNNCE Campus, Navule, Savalanga Road<br />
                                            Shivamogga – 577201, Karnataka, India
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="text-accent-400 w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/30 mb-0.5 uppercase tracking-wider">Phone</div>
                                        <a href="tel:+918182225341" className="text-sm text-white/65 hover:text-primary-300 transition-colors">08182 – 225341 (Principal)</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-yellow-400 w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/30 mb-0.5 uppercase tracking-wider">Email</div>
                                        <a href="mailto:rai@jnnce.ac.in" className="text-sm text-white/65 hover:text-primary-300 transition-colors block">rai@jnnce.ac.in (Department)</a>
                                        <a href="mailto:principal@jnnce.ac.in" className="text-sm text-white/40 hover:text-primary-300 transition-colors block">principal@jnnce.ac.in</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social + External */}
                        <div className="glass-card p-5">
                            <h3 className="font-semibold text-white mb-4 text-sm">Official Links</h3>
                            <div className="space-y-2">
                                {[
                                    { Icon: FiExternalLink, href: 'https://jnnce.ac.in', label: 'JNNCE Official Website' },
                                    { Icon: FiExternalLink, href: 'https://vtu.ac.in', label: 'VTU – Visvesvaraya Technological University' },
                                    { Icon: FiLinkedin, href: 'https://linkedin.com', label: 'JNNCE LinkedIn' },
                                    { Icon: FiYoutube, href: 'https://youtube.com', label: 'JNNCE YouTube Channel' },
                                ].map(({ Icon, href, label }) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/5 text-white/45 hover:text-primary-300 transition-all text-sm">
                                        <Icon className="w-4 h-4 flex-shrink-0" />{label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Map embed placeholder */}
                        <div className="glass-card overflow-hidden">
                            <div className="h-44 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
                                <div className="text-center text-white/25">
                                    <FiMapPin className="w-7 h-7 mx-auto mb-2" />
                                    <p className="text-sm font-medium">JNNCE – Shivamogga</p>
                                    <p className="text-xs mt-0.5">Navule, Savalanga Road</p>
                                    <a href="https://maps.google.com/?q=JNNCE+Shivamogga" target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-primary-400 hover:text-primary-300 mt-2 block hover:underline">
                                        Open in Google Maps →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
