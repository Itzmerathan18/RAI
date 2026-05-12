'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getResearch, getPublications, getAnalytics } from '@/lib/api';

const DOMAINS = ['All', 'Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'];
const STATUS = ['All', 'ongoing', 'completed'];

export default function ResearchPage() {
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [stats, setStats] = useState({ research: 0, publications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResearch({ limit: 50 })
      .then(res => { if (res.data?.success && res.data?.data) setProjects(res.data.data); })
      .catch(() => setProjects([]));
    getPublications({ limit: 20 })
      .then(res => { if (res.data?.success && res.data?.data) setPublications(res.data.data); })
      .catch(() => setPublications([]));
    getAnalytics()
      .then(res => {
        if (res.data?.success && res.data?.data) {
          const a = res.data.data as any;
          setStats({ research: a.research ?? 0, publications: a.publications ?? 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(
    p => (domainFilter === 'All' || p.domain === domainFilter) && (statusFilter === 'All' || p.status === statusFilter)
  );

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">Research & Innovation</div>
          <h1 className="section-title text-5xl gradient-text mb-4">Funded Projects & Research</h1>
          <p className="text-white/50 max-w-xl mx-auto">Government-funded and internally funded research in robotics and AI</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Research Projects', value: String(stats.research || filtered.length) },
            { label: 'Publications', value: String(stats.publications || publications.length) },
          ].map(s => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="text-3xl font-display font-black gradient-text">{s.value}</div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${domainFilter === d ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              {d}
            </button>
          ))}
          <div className="border-l border-white/10 pl-3 flex gap-2">
            {STATUS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${statusFilter === s ? 'bg-accent-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="text-center py-12 text-white/40">Loading…</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {!loading && filtered.map((proj, i) => (
            <motion.div
              key={proj._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`badge text-xs ${proj.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-300'}`}>
                  {proj.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                </span>
                <span className="text-xs text-white/30">{proj.year}</span>
              </div>
              <h3 className="font-semibold text-white mb-2 leading-snug flex-1">{proj.title}</h3>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">{proj.description || '—'}</p>
              <div className="space-y-1.5 text-xs text-white/40 border-t border-white/5 pt-3">
                {(proj.fundingAgency || proj.fundedAmount) && (
                  <div>🏛 {[proj.fundingAgency, proj.fundedAmount].filter(Boolean).join(' · ')}</div>
                )}
                <div>👨‍🏫 {proj.facultyGuide}</div>
                <div>📂 {proj.domain}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="section-title text-3xl text-white mb-6" id="publications">📄 Publications</h2>
          {publications.length === 0 && !loading && <p className="text-white/30 text-sm">No publications listed yet.</p>}
          <div className="space-y-4">
            {publications.map((pub, i) => (
              <motion.div
                key={pub._id || i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-5 flex items-start gap-4 hover:border-primary-500/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-300 font-bold text-sm flex-shrink-0">{i + 1}</div>
                <div>
                  <h3 className="font-medium text-white mb-1 leading-snug">{pub.title}</h3>
                  {pub.journal && <p className="text-sm text-accent-400 mb-1">{pub.journal}</p>}
                  <p className="text-xs text-white/40">{pub.authors} · {pub.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
