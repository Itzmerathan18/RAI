'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowDown } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { timeline, techStack, achievementMetrics as fallbackMetrics } from '@/data/home';
import { getNotices, getProjects, getAnalytics, getPlacements } from '@/lib/api';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), { ssr: false });

function CyberFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={200 + i * 8} y1="0" x2={200 + i * 160} y2="80" stroke="#00E5FF" strokeWidth="0.5" opacity="0.15" />
        ))}
        {[0.15, 0.3, 0.5, 0.7, 1].map((t, i) => (
          <line key={i} x1={200 - t * 200} y1={t * 80} x2={200 + t * 200} y2={t * 80} stroke="#00E5FF" strokeWidth="0.5" opacity={0.05 + t * 0.12} />
        ))}
      </svg>
    </div>
  );
}

const tagColors: Record<string, string> = {
  Exam: 'bg-red-500/15 text-red-400 border border-red-500/20',
  Event: 'bg-cyber/10 text-cyber border border-cyber/20',
  Scholarship: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
};

const researchAreas = [
  { icon: '🦾', title: 'Industrial Robotics', desc: 'Pick-and-place automation, robotic arms, PLC integration, and factory floor systems.' },
  { icon: '👁', title: 'Computer Vision', desc: 'Object detection, YOLO, OpenCV, real-time visual intelligence for robots.' },
  { icon: '🧠', title: 'AI & Machine Learning', desc: 'Deep learning, reinforcement learning, GPU computing, and neural networks.' },
  { icon: '🚗', title: 'Autonomous Systems', desc: 'Self-driving principles, SLAM, path planning, LiDAR and sensor fusion.' },
  { icon: '⚙️', title: 'Industrial Automation', desc: 'SCADA, IoT integration, Smart Manufacturing, Industry 4.0 protocols.' },
  { icon: '🤝', title: 'Human-Robot Interaction', desc: 'Collaborative robots (cobots), gesture recognition, safety systems.' },
];

function formatDate(d: string | Date) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [achievementMetrics, setAchievementMetrics] = useState(fallbackMetrics);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    getNotices().then(res => {
      if (res.data?.success && res.data?.data) setNotices((res.data.data as any[]).slice(0, 4));
    }).catch(() => setNotices([]));
    getProjects().then(res => {
      if (res.data?.success && res.data?.data) {
        const list = (res.data.data as any[]).slice(0, 4).map((p: any) => ({
          id: p._id,
          title: p.title,
          desc: p.description || '—',
          tech: p.domain ? [p.domain] : [],
          emoji: '🦾',
          href: '/projects',
          award: p.fundingAgency || null,
        }));
        setFeaturedProjects(list);
      }
    }).catch(() => setFeaturedProjects([]));
    getAnalytics().then(res => {
      if (res.data?.success && res.data?.data) {
        const a = res.data.data as any;
        getPlacements().then(pr => {
          let placementRate = 90;
          if (pr.data?.success && pr.data?.data?.length) {
            const latest = pr.data.data[0]; // backend sorts by -year, so first is latest
            if (latest.total > 0) placementRate = Math.round((latest.placed / latest.total) * 100);
          }
          setAchievementMetrics([
            { value: a.research ?? 15, suffix: '+', label: 'Research Projects' },
            { value: a.achievements ?? 10, suffix: '+', label: 'Achievements' },
            { value: a.publications ?? 5, suffix: '+', label: 'Research Papers' },
            { value: a.students ?? 20, suffix: '+', label: 'Team Members' },
            { value: placementRate, suffix: '%', label: 'Placement Rate' },
            { value: a.faculty ?? 12, suffix: '+', label: 'Expert Faculty' },
          ]);
        }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">

      {/* ═══ HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HeroCanvas />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[1]"
          style={{ backgroundImage: 'url(/images/jnnce-campus.jpeg)', opacity: 0.12, filter: 'grayscale(40%) brightness(0.5)' }}
        />
        <div className="cyber-grid z-[1]" />
        <div className="orb w-[600px] h-[600px] bg-cyan-900 z-[2]" style={{ top: '-150px', left: '-150px', opacity: 0.08 }} />
        <div className="orb w-[400px] h-[400px] bg-cyan-700 z-[2]" style={{ bottom: '0', right: '-100px', opacity: 0.06, animationDelay: '3s' }} />
        <div className="absolute inset-0 pointer-events-none scan-line z-[2]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex flex-col items-center">
              <div className="p-3 mb-6 bg-white rounded-full shadow-glow">
                <img src="/images/jnnce-logo.png" alt="JNNCE Logo" className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs sm:text-sm font-orbitron tracking-widest uppercase shadow-glow mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
                Est. 1980 · VTU · NAAC A · AICTE Approved
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-1">
              <div className="text-white/35 text-xs font-space uppercase tracking-[0.3em] mb-2">JNNCE · Shivamogga, Karnataka</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <h1 className="font-orbitron font-black leading-none mt-6 mb-2" style={{ fontSize: 'clamp(1.6rem, 5vw, 3.6rem)' }}>
                <span className="gradient-text">RAI — Robotics &amp;</span>
              </h1>
              <h1 className="font-orbitron font-black leading-none mb-2" style={{ fontSize: 'clamp(1.6rem, 5vw, 3.6rem)' }}>
                <span className="text-white">Artificial Intelligence Lab</span>
              </h1>
              <div className="cyber-line my-2 max-w-xs mx-auto" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-white/50 text-base sm:text-lg font-space tracking-wide mt-4 mb-2">
              Building Intelligent Autonomous Systems
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/40 text-sm font-space tracking-[0.18em] uppercase mb-8">
              AI · Robotics · Computer Vision · Automation
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 justify-center mb-10">
              <Link href="/projects" className="btn-primary">
                Explore Projects <FiArrowRight />
              </Link>
              <Link href="/contact" className="btn-secondary">Join Research</Link>
              <Link href="/research" className="btn-secondary">View Research</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-6">
              {[
                { val: '60', label: 'Intake / Year' },
                { val: 'B.E.', label: '4-Year Programme' },
                { val: '5', label: 'Research Labs' },
                { val: '90%', label: 'Placement Rate' },
              ].map((b) => (
                <div key={b.label} className="text-center">
                  <div className="font-orbitron text-cyber text-lg font-bold">{b.val}</div>
                  <div className="text-white/30 text-xs tracking-wider uppercase">{b.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        {mounted && <CyberFloor />}
        <motion.a href="#about" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center gap-2 hover:text-cyber transition-colors z-10">
          <span className="text-xs font-orbitron tracking-widest uppercase">Scroll</span>
          <FiArrowDown />
        </motion.a>
      </section>

      {/* ═══ ABOUT RAI (Mission + Timeline) ─────────────────────────────────── */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">About RAI Lab</div>
          <h2 className="section-title text-3xl text-white mb-3">Advancing Robotics &amp; AI Through <span className="gradient-text-static">Innovation</span></h2>
          <p className="text-white/45 font-space text-sm max-w-2xl mx-auto">
            Our mission is to advance Robotics and Artificial Intelligence through research, collaboration, and hands-on engineering — preparing the next generation for Industry 4.0 and beyond.
          </p>
        </motion.div>
        <div className="glass-card-cyan p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-orbitron font-bold text-cyber text-sm uppercase tracking-widest mb-4">Our Vision</h3>
              <p className="text-white/55 leading-relaxed font-space mb-4">
                Established in <strong className="text-cyber">2020</strong>, the Department of RAI at JNNCE blends <strong className="text-white">Robotics, AI, Mechatronics, Control Systems, and Embedded Systems</strong> — training engineers to build intelligent machines.
              </p>
              <p className="text-white/55 leading-relaxed font-space">
                Affiliated to <strong className="text-white">VTU, Belagavi</strong>, recognised by <strong className="text-white">AICTE</strong>, with an annual intake of <strong className="text-cyber">60 students</strong> and active ties with ABB, Bosch, Siemens, and FANUC.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { icon: '🏛', label: 'JNNCE Est.', value: '1980' },
                  { icon: '🤖', label: 'RAI Dept.', value: '2020' },
                  { icon: '📞', label: 'Phone', value: '08182-225341' },
                  { icon: '📍', label: 'Location', value: 'Navule, Shivamogga' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl border border-white/6 bg-white/3 hover:border-cyber/20 transition-colors">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span>{item.icon}</span>
                      <span className="text-xs text-white/30 uppercase tracking-wider font-orbitron">{item.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                '75+ faculty, 45+ with Ph.D in engineering',
                'NAAC A Grade · AICTE-IDEA Lab (NEP 2020)',
                'GPU-powered AI & ML Research Lab',
                'RoboDK simulation + hardware labs',
                'Industry: ABB, Bosch, Siemens, FANUC',
              ].map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-cyber/3 hover:bg-cyber/6 border border-cyber/8 hover:border-cyber/20 transition-all">
                  <span className="text-cyber flex-shrink-0 mt-0.5 font-bold text-sm">✓</span>
                  <span className="text-sm text-white/60 font-space">{h}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-8">Timeline</div>
          <div className="relative pl-10 md:max-w-3xl md:mx-auto md:pl-12">
            <div className="timeline-line" />
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-4 py-6 md:py-8"
                >
                  <div className="flex-shrink-0 w-14 text-left -ml-[2.25rem] md:-ml-14">
                    <span className="font-orbitron font-bold text-cyber text-lg">{item.year}</span>
                  </div>
                  <div className="flex-1 glass-card p-5 border border-white/5 hover:border-cyber/25 card-glow-hover">
                    <h4 className="font-orbitron font-bold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-white/45 text-xs font-space">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ RESEARCH AREAS ────────────────────────────────────────────────── */}
      <section id="research" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Research Focus</div>
          <h2 className="section-title text-2xl text-white mb-3">Core Research <span className="gradient-text-static">Areas</span></h2>
          <p className="text-white/35 text-sm">Active projects funded by VTU, DST-SERB, DRDO, and AICTE</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {researchAreas.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 border border-white/5 card-glow-hover group cursor-default"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{r.icon}</div>
              <h3 className="font-orbitron font-bold text-sm text-cyber mb-2 uppercase tracking-wider">{r.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed font-space">{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/research" className="btn-secondary text-sm">View All Research <FiArrowRight /></Link>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ────────────────────────────────────────────────── */}
      <section id="projects" className="py-20" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.03), transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Showcase</div>
            <h2 className="section-title text-2xl text-white mb-3">Featured <span className="gradient-text-static">Projects</span></h2>
            <p className="text-white/35 text-sm">Robotics, AI, and automation projects from RAI Lab</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.length === 0 && <p className="text-white/30 text-sm col-span-2">No featured projects yet.</p>}
            {featuredProjects.map((proj, i) => (
              <motion.div
                key={proj.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={proj.href || '/projects'} className="block glass-card p-6 border border-white/5 hover:border-cyber/30 card-glow-hover group h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">{proj.emoji || '🦾'}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron font-bold text-white mb-2 group-hover:text-cyber transition-colors">{proj.title}</h3>
                      <p className="text-sm text-white/45 font-space mb-4">{proj.desc}</p>
                      {Array.isArray(proj.tech) && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {proj.tech.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-cyber/10 text-cyber text-xs font-orbitron border border-cyber/20">{t}</span>
                          ))}
                        </div>
                      )}
                      {proj.award && <p className="text-xs text-white/35 font-space">🏆 {proj.award}</p>}
                    </div>
                    <FiArrowRight className="text-white/20 group-hover:text-cyber group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects" className="btn-primary text-sm">View All Projects <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ═══ ROBOTICS GALLERY TEASER ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Lab &amp; Builds</div>
          <h2 className="section-title text-2xl text-white mb-3">Robotics <span className="gradient-text-static">Gallery</span></h2>
          <p className="text-white/35 text-sm">Robot prototypes, electronics, and lab photos</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="gallery-masonry max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link key={i} href="/gallery" className={`rounded-xl overflow-hidden border border-white/10 hover:border-cyber/30 transition-all bg-white/5 ${i === 2 || i === 5 ? 'tall' : ''} ${i === 3 ? 'wide' : ''}`}>
              <div className="w-full h-full bg-gradient-to-br from-cyber/10 to-transparent flex items-center justify-center text-4xl opacity-60">
                {['🦾', '🔬', '📡', '🤖', '⚙️', '🧪'][i - 1]}
              </div>
            </Link>
          ))}
        </motion.div>
        <div className="text-center mt-8">
          <Link href="/gallery" className="btn-secondary text-sm">View Full Gallery <FiArrowRight /></Link>
        </div>
      </section>

      {/* ═══ TECH STACK ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.03), transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Technologies</div>
            <h2 className="section-title text-2xl text-white mb-3">Tech <span className="gradient-text-static">Stack</span></h2>
            <p className="text-white/35 text-sm">Tools and platforms we use in research and projects</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-4">
            {techStack.map((t, i) => (
              <motion.span
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="px-5 py-3 rounded-xl glass-card border border-white/5 hover:border-cyber/25 text-white/60 hover:text-cyber font-orbitron text-sm uppercase tracking-wider transition-all cursor-default"
              >
                {t.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ ACHIEVEMENTS DASHBOARD ────────────────────────────────────────── */}
      <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">Achievements</div>
          <h2 className="section-title text-3xl text-white mb-2">Numbers That Define <span className="gradient-text-static">Excellence</span></h2>
          <p className="text-white/35 font-space text-sm">JNNCE RAI · Building intelligent engineers since 2020</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievementMetrics.map((stat, i) => (
            <AchievementCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ TEAM TEASER ─────────────────────────────────────────────────────── */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">People</div>
          <h2 className="section-title text-2xl text-white mb-3">Our <span className="gradient-text-static">Team</span></h2>
          <p className="text-white/35 text-sm max-w-xl mx-auto">Faculty and researchers driving robotics and AI at JNNCE</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-full border-2 border-cyber/30 bg-white/5 flex items-center justify-center text-2xl hover:border-cyber hover:shadow-glow transition-all cursor-default">
              👨‍🔬
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center">
          <Link href="/faculty" className="btn-primary text-sm">View Faculty Directory <FiArrowRight /></Link>
        </div>
      </section>

      {/* ═══ JOIN RAI LAB ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card-cyan p-10 md:p-14 text-center relative overflow-hidden">
          <div className="cyber-grid absolute inset-0 opacity-50" />
          <div className="relative z-10">
            <div className="font-orbitron text-cyber text-xs uppercase tracking-widest mb-3">Open Research Opportunities</div>
            <h2 className="section-title text-2xl md:text-3xl text-white mb-4">Join RAI Lab</h2>
            <p className="text-white/45 mb-6 max-w-lg mx-auto font-space text-sm">
              Interested in robotics research? We are always looking for innovators. Collaborate with us on projects, hackathons, and publications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <Link href="/contact" className="btn-primary">Join Team <FiArrowRight /></Link>
              <Link href="/contact" className="btn-secondary">Collaborate</Link>
            </div>
            <p className="text-xs text-white/25 font-space">
              📍 JNNCE, Navule, Savalanga Road, Shivamogga – 577201 &nbsp;|&nbsp; 📞 08182-225341 &nbsp;|&nbsp; ✉ rai@jnnce.ac.in
            </p>
          </div>
        </motion.div>
      </section>

            {/* ═══ NOTICES + QUICK ACCESS ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="section-title text-xl text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-7 rounded-full bg-cyber" />
              Latest Notices
            </h2>
            <div className="space-y-3">
              {notices.length === 0 && <p className="text-white/30 text-sm">No notices yet. Check back later.</p>}
              {notices.map((n, i) => (
                <motion.div key={n._id || i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                  <Link href="/notices" className="flex items-start gap-3 p-4 glass-card hover:border-cyber/20 transition-all group">
                    <span className={`badge flex-shrink-0 text-xs ${tagColors[n.category] || 'bg-white/10 text-white/40'}`}>{n.category}</span>
                    <div className="flex-1">
                      <p className="text-sm text-white/65 group-hover:text-white transition-colors font-space">{n.title}</p>
                      <p className="text-xs text-white/25 mt-1">📅 {formatDate(n.date)}</p>
                    </div>
                    <FiArrowRight className="text-white/15 group-hover:text-cyber transition-colors mt-0.5 flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link href="/notices" className="mt-4 btn-secondary inline-flex text-sm">All Notices <FiArrowRight /></Link>
          </div>
          <div>
            <h2 className="section-title text-xl text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-7 rounded-full bg-cyber" />
              Quick Access
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '📖', label: 'Syllabus & Curriculum', href: '/academics' },
                { emoji: '👨‍🏫', label: 'Faculty Directory', href: '/faculty' },
                { emoji: '🔬', label: 'Research Projects', href: '/research' },
                { emoji: '🧪', label: 'Laboratories', href: '/labs' },
                { emoji: '🏆', label: 'Placements', href: '/placements' },
                { emoji: '🖼', label: 'Gallery', href: '/gallery' },
              ].map((ql) => (
                <motion.div key={ql.label} whileHover={{ scale: 1.03 }}>
                  <Link href={ql.href} className="flex items-center gap-3 p-4 glass-card hover:border-cyber/25 hover:bg-cyber/4 transition-all group">
                    <span className="text-2xl">{ql.emoji}</span>
                    <span className="text-sm text-white/55 group-hover:text-cyber transition-colors font-space">{ql.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AchievementCard({ stat, index }: { stat: { label: string; value: number; suffix: string }; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-5 text-center group border border-white/5 hover:border-cyber/30 hover:shadow-glow transition-all duration-300"
    >
      <div className="font-orbitron text-3xl font-black text-cyber mb-1">
        {inView ? <CountUp end={stat.value} duration={2.2} suffix={stat.suffix} /> : '0'}
      </div>
      <div className="text-xs text-white/45 uppercase tracking-wider">{stat.label}</div>
    </motion.div>
  );
}
