'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '@/lib/api';

const DOMAINS = ['All', 'Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'];
const domainEmoji: Record<string, string> = {
  'Autonomous Robots': '🦾',
  'Computer Vision': '👁',
  'SLAM': '🗺',
  'AI Automation': '🤖',
  'Control & Path Planning': '⚙️',
  'IoT': '🌾',
  'Other': '🔬',
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => {
        if (res.data?.success && res.data?.data) setProjects(res.data.data);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.domain === filter);

  return (
    <div className="min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
          Student Innovation
        </div>
        <h1 className="section-title text-3xl text-white mb-3">
          Student <span className="gradient-text-static">Projects</span>
        </h1>
        <p className="text-white/35 text-sm font-space">Real-world robotics and AI projects from RAI at JNNCE</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {DOMAINS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-orbitron uppercase tracking-wider transition-all ${
              filter === f ? 'bg-cyber text-black border border-cyber shadow-glow' : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/40">Loading projects…</div>
      ) : (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p._id || p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.35)' }}
                className="glass-card p-6 border border-white/5 hover:shadow-glow transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyber/10 border border-cyber/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {domainEmoji[p.domain] || '🔬'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="badge-cyber badge text-[10px]">{p.domain || 'Other'}</span>
                      <span className="text-[10px] text-white/25 font-space">{p.year}</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-white text-sm leading-tight">{p.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/45 leading-relaxed font-space mb-4 flex-1">{p.description || '—'}</p>
                {(p.fundingAgency || p.fundingAmount) && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-cyber/6 border border-cyber/15 text-xs text-cyber font-space">
                    🏆 {[p.fundingAgency, p.fundingAmount && `₹${p.fundingAmount}L`].filter(Boolean).join(' · ')}
                  </div>
                )}
                {p.faculty && (
                  <div className="mb-3">
                    <div className="text-[10px] text-white/25 uppercase tracking-widest font-orbitron mb-1.5">Faculty</div>
                    <span className="text-xs text-white/50 font-space">
                      {typeof p.faculty === 'object' ? p.faculty?.name : p.faculty}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-auto">
                  <span className={`badge text-[10px] ${p.status === 'ongoing' ? 'bg-cyber/20 text-cyber' : 'bg-white/10 text-white/50'}`}>
                    {p.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-white/20 font-space text-sm">No projects in this category.</div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14 glass-card-cyan p-8 text-center max-w-xl mx-auto"
      >
        <div className="text-3xl mb-3">💡</div>
        <h3 className="font-orbitron font-bold text-white text-base mb-2">Submit Your Project</h3>
        <p className="text-sm text-white/40 mb-5 font-space">RAI students can submit their projects for showcase. Contact the department with your project report.</p>
        <a href="mailto:rai@jnnce.ac.in" className="btn-primary text-sm">Submit via Email</a>
      </motion.div>
    </div>
  );
}
