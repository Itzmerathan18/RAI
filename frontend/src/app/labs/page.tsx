'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLabs } from '@/lib/api';

const LAB_EMOJIS = ['🤖', '🧪', '🔩', '🧠', '💡'];
const LAB_COLORS = ['from-blue-600 to-primary-600', 'from-purple-600 to-blue-600', 'from-orange-600 to-red-600', 'from-violet-600 to-pink-600', 'from-green-600 to-emerald-600'];

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLabs()
      .then(res => { if (res.data?.success && res.data?.data) setLabs(res.data.data); })
      .catch(() => setLabs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">World-Class Infrastructure</div>
          <h1 className="section-title text-5xl gradient-text mb-4">Research Laboratories</h1>
          <p className="text-white/50 max-w-2xl mx-auto">Specialized laboratories for robotics, AI, and hands-on research at RAI · JNNCE</p>
        </motion.div>

        {loading && <div className="text-center py-12 text-white/40">Loading labs…</div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-5 text-center hover:border-primary-500/30 transition-all">
            <div className="text-3xl mb-2">🧪</div>
            <div className="text-3xl font-display font-black gradient-text">{labs.length}</div>
            <div className="text-xs text-white/40 mt-1">Labs</div>
          </div>
        </div>

        <div className="space-y-8">
          {labs.map((lab, i) => (
            <motion.div
              key={lab._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.005 }}
              className="glass-card overflow-hidden hover:border-primary-500/30 transition-all duration-300"
            >
              <div className={`h-1.5 bg-gradient-to-r ${LAB_COLORS[i % LAB_COLORS.length]}`} />
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${LAB_COLORS[i % LAB_COLORS.length]} flex items-center justify-center text-3xl shadow-glow`}>
                        {LAB_EMOJIS[i % LAB_EMOJIS.length]}
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-lg text-white leading-tight">{lab.name}</h2>
                      </div>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed">{lab.description || '—'}</p>
                  </div>
                  <div className="lg:w-2/3">
                    {Array.isArray(lab.equipment) && lab.equipment.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-primary-400 text-xs uppercase tracking-widest mb-3">Equipment & Hardware</h3>
                        <ul className="space-y-2">
                          {lab.equipment.map((eq: string) => (
                            <li key={eq} className="flex items-start gap-2 text-sm text-white/55">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                              {eq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && labs.length === 0 && (
          <div className="text-center py-16 text-white/30">No labs data yet.</div>
        )}

        <p className="text-center text-xs text-white/20 mt-8">
          Source: JNNCE Dept. of RAI. Visit{' '}
          <a href="https://jnnce.ac.in" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">jnnce.ac.in</a> for official details.
        </p>
      </section>
    </div>
  );
}
