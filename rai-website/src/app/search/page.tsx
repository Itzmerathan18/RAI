'use client';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiBook, FiFileText, FiBell, FiCode, FiX } from 'react-icons/fi';
import Link from 'next/link';

type Faculty = { _id: string; name: string; designation: string; specialization: string; photo?: string };
type Research = { _id: string; title: string; description: string; status: string; year: number; domain: string };
type Publication = { _id: string; title: string; authors: string; journal: string; year: number; downloadUrl?: string };
type Notice = { _id: string; title: string; description: string; category: string; important: boolean };
type Project = { _id: string; title: string; description: string; technologies: string[]; thumbnail?: string };

type Results = {
    faculty: Faculty[];
    research: Research[];
    publications: Publication[];
    notices: Notice[];
    projects: Project[];
};

const EMPTY: Results = { faculty: [], research: [], publications: [], notices: [], projects: [] };

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Results>(EMPTY);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [total, setTotal] = useState(0);
    const debounce = useRef<ReturnType<typeof setTimeout>>();

    const doSearch = useCallback(async (q: string) => {
        if (q.trim().length < 2) {
            setResults(EMPTY);
            setSearched(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const json = await res.json();
            if (json.success) {
                setResults(json.data);
                setTotal(json.total ?? 0);
            } else {
                setResults(EMPTY);
                setTotal(0);
            }
        } catch { setResults(EMPTY); setTotal(0); }
        finally { setLoading(false); setSearched(true); }
    }, []);

    const handleChange = (val: string) => {
        setQuery(val);
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => doSearch(val), 400);
    };

    const hasResults = total > 0;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-cyber/10 border border-cyber/30 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                    Global Search
                </div>
                <h1 className="section-title text-4xl gradient-text mb-3">Search the Department</h1>
                <p className="text-white/40 text-sm">Find faculty, research, publications, notices, and projects</p>
            </motion.div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                    value={query}
                    onChange={e => handleChange(e.target.value)}
                    placeholder="Search for faculty, research topics, paper titles…"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/25 focus:outline-none focus:border-cyber/50 focus:ring-1 focus:ring-cyber/30 transition-all text-base"
                    autoFocus
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults(EMPTY); setSearched(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" />
                </div>
            )}

            {/* Results */}
            {!loading && searched && (
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {!hasResults ? (
                            <div className="text-center py-16 text-white/30">
                                <div className="text-5xl mb-4">🔍</div>
                                <p>No results found for "<span className="text-white/50">{query}</span>"</p>
                                <p className="text-xs mt-2">Try searching for a faculty name, research topic, or publication title.</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <p className="text-white/40 text-sm">{total} result{total !== 1 ? 's' : ''} for "<span className="text-white/70">{query}</span>"</p>

                                {/* Faculty */}
                                {results.faculty.length > 0 && (
                                    <Section icon={<FiUser />} label="Faculty" count={results.faculty.length} href="/faculty">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {results.faculty.map(f => (
                                                <Link key={f._id} href={`/faculty/${f._id}`}
                                                    className="flex items-center gap-3 glass-card p-4 hover:border-cyber/30 transition-all">
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-700 to-accent-700 flex items-center justify-center text-white font-bold text-sm">
                                                        {f.photo && f.photo !== '/images/default-avatar.png'
                                                            ? <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                                                            : f.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{f.name}</p>
                                                        <p className="text-white/40 text-xs">{f.designation}</p>
                                                        {f.specialization && <span className="badge bg-white/5 text-white/40 text-xs mt-1">{f.specialization}</span>}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Research */}
                                {results.research.length > 0 && (
                                    <Section icon={<FiBook />} label="Research Projects" count={results.research.length} href="/research">
                                        <div className="space-y-3">
                                            {results.research.map(r => (
                                                <Link key={r._id} href={`/research/${r._id}`}
                                                    className="block glass-card p-4 hover:border-primary-500/30 transition-all">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-white text-sm font-medium leading-snug mb-1">{r.title}</h3>
                                                            <p className="text-white/40 text-xs line-clamp-2">{r.description}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                            <span className={`badge text-xs ${r.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-white/10 text-white/50'}`}>
                                                                {r.status === 'ongoing' ? '🟢 Ongoing' : '✅ Done'}
                                                            </span>
                                                            {r.year && <span className="text-white/30 text-xs">{r.year}</span>}
                                                        </div>
                                                    </div>
                                                    {r.domain && <span className="badge bg-primary-500/10 text-primary-400 text-xs mt-2">{r.domain}</span>}
                                                </Link>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Publications */}
                                {results.publications.length > 0 && (
                                    <Section icon={<FiFileText />} label="Publications" count={results.publications.length} href="/research#publications">
                                        <div className="space-y-3">
                                            {results.publications.map((p, i) => (
                                                <div key={p._id} className="glass-card p-4 flex items-start gap-4">
                                                    <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-300 font-bold text-xs flex-shrink-0">{i + 1}</div>
                                                    <div className="flex-1">
                                                        <h3 className="text-white text-sm font-medium leading-snug mb-1">{p.title}</h3>
                                                        <p className="text-accent-400 text-xs">{p.journal} · {p.year}</p>
                                                        <p className="text-white/40 text-xs">{p.authors}</p>
                                                    </div>
                                                    {p.downloadUrl && (
                                                        <a href={p.downloadUrl} target="_blank" rel="noopener noreferrer"
                                                            className="text-white/30 hover:text-cyber transition-colors text-xs flex-shrink-0 py-1 px-2 rounded-lg bg-white/5">PDF</a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Notices */}
                                {results.notices.length > 0 && (
                                    <Section icon={<FiBell />} label="Notices" count={results.notices.length} href="/notices">
                                        <div className="space-y-3">
                                            {results.notices.map(n => (
                                                <div key={n._id} className="glass-card p-4 flex items-start gap-3">
                                                    {n.important && <span className="text-orange-400 text-xs font-bold flex-shrink-0 pt-0.5">🔴 Important</span>}
                                                    <div>
                                                        <h3 className="text-white text-sm font-medium">{n.title}</h3>
                                                        <p className="text-white/40 text-xs mt-1 line-clamp-2">{n.description}</p>
                                                        <span className="badge bg-white/5 text-white/40 text-xs mt-2">{n.category}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Projects */}
                                {results.projects.length > 0 && (
                                    <Section icon={<FiCode />} label="Student Projects" count={results.projects.length} href="/projects">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {results.projects.map(p => (
                                                <Link key={p._id} href={`/projects/${p._id}`}
                                                    className="glass-card p-4 hover:border-primary-500/30 transition-all">
                                                    <h3 className="text-white text-sm font-medium mb-1 leading-snug">{p.title}</h3>
                                                    <p className="text-white/40 text-xs mb-3 line-clamp-2">{p.description}</p>
                                                    {p.technologies?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {p.technologies.slice(0, 3).map(t => (
                                                                <span key={t} className="badge bg-cyber/10 text-cyber text-xs">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </Section>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Empty state */}
            {!loading && !searched && (
                <div className="text-center py-16 text-white/20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-sm">Start typing to search across the entire department</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {['robotics', 'autonomous', 'faculty', 'workshop', 'AI'].map(s => (
                            <button key={s} onClick={() => { setQuery(s); handleChange(s); }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white text-xs transition-all">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Section({ icon, label, count, href, children }: {
    icon: React.ReactNode;
    label: string;
    count: number;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-cyber">{icon}</span> {label}
                    <span className="badge bg-cyber/10 text-cyber text-xs">{count}</span>
                </h2>
                <Link href={href} className="text-xs text-white/30 hover:text-cyber transition-colors">View all →</Link>
            </div>
            {children}
        </section>
    );
}
