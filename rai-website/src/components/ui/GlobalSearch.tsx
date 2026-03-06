'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface SearchResult {
    id: string;
    type: 'faculty' | 'research' | 'publication';
    title: string;
    subtitle?: string;
    href: string;
}

export default function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const search = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            const combined: SearchResult[] = [
                ...(data.data?.faculty || []).slice(0, 3).map((f: any) => ({
                    id: f._id, type: 'faculty' as const,
                    title: f.name, subtitle: f.designation,
                    href: `/faculty/${f._id}`,
                })),
                ...(data.data?.research || []).slice(0, 3).map((r: any) => ({
                    id: r._id, type: 'research' as const,
                    title: r.title, subtitle: r.domain,
                    href: `/research/${r._id}`,
                })),
                ...(data.data?.publications || []).slice(0, 3).map((p: any) => ({
                    id: p._id, type: 'publication' as const,
                    title: p.title, subtitle: p.journal,
                    href: `/research#publications`,
                })),
            ];
            setResults(combined);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(query), 400);
        return () => clearTimeout(debounceRef.current);
    }, [query, search]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Keyboard shortcut: Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const typeIcon = { faculty: '👨‍🏫', research: '🔬', publication: '📄' };
    const typeLabel = { faculty: 'Faculty', research: 'Research', publication: 'Publication' };

    return (
        <>
            {/* Trigger button in navbar */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:border-cyber/30 hover:text-cyber transition-all text-xs"
            >
                <FiSearch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline text-white/20 text-xs">Ctrl+K</kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
                        onClick={() => setOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10 w-full max-w-xl glass-card border border-white/15 overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                                {loading ? <FiLoader className="w-4 h-4 text-cyber animate-spin" /> : <FiSearch className="w-4 h-4 text-white/40" />}
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Search faculty, research, publications…"
                                    className="flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none text-sm"
                                />
                                <button onClick={() => setOpen(false)}>
                                    <FiX className="w-4 h-4 text-white/30 hover:text-white transition-colors" />
                                </button>
                            </div>

                            <AnimatePresence>
                                {results.length > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-h-80 overflow-y-auto">
                                        {results.map(r => (
                                            <Link
                                                key={`${r.type}-${r.id}`}
                                                href={r.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <span className="text-lg flex-shrink-0">{typeIcon[r.type]}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-white font-medium truncate">{r.title}</div>
                                                    {r.subtitle && <div className="text-xs text-white/40 truncate">{r.subtitle}</div>}
                                                </div>
                                                <span className="badge bg-white/5 text-white/30 text-xs flex-shrink-0">{typeLabel[r.type]}</span>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                                {query.trim() && !loading && results.length === 0 && (
                                    <div className="px-4 py-8 text-center text-white/30 text-sm">
                                        No results for &ldquo;{query}&rdquo;
                                    </div>
                                )}
                            </AnimatePresence>

                            {!query && (
                                <div className="px-4 py-4 text-xs text-white/20 font-space">
                                    Try searching for "SLAM", "Computer Vision", or a faculty name
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
