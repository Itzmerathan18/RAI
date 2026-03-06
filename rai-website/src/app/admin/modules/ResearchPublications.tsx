'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors text-sm";

function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('rai_token') || '' : ''; }

async function apiReq(path: string, method = 'GET', body?: object) {
    const token = getToken();
    const res = await fetch(`${API}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-lg glass-card p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-white">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"><FiX className="w-5 h-5" /></button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="mb-4"><label className="text-sm text-white/50 mb-1.5 block">{label}</label>{children}</div>;
}

// ── RESEARCH MODULE ──────────────────────────────────────────────────────────
const BLANK_RESEARCH = { title: '', facultyGuide: '', description: '', domain: 'Other', year: new Date().getFullYear(), status: 'ongoing', fundingAgency: '', fundedAmount: '', paperUrl: '', teamMembers: '', published: true };
const DOMAINS = ['Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'];

export function ResearchModule() {
    const [data, setData] = useState<any[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(BLANK_RESEARCH);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/research'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function save() {
        if (!editing.title?.trim()) { toast.error('Title required'); return; }
        try {
            const payload = { ...editing, teamMembers: editing.teamMembers ? editing.teamMembers.split(',').map((s: string) => s.trim()) : [] };
            if (modal === 'add') { await apiReq('/research', 'POST', payload); toast.success('Research project added!'); }
            else { await apiReq(`/research/${editing._id}`, 'PUT', payload); toast.success('Project updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error'); }
    }

    async function del(id: string) {
        try { await apiReq(`/research/${id}`, 'DELETE'); toast.success('Deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error'); }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Research Projects</h1><p className="text-white/35 text-sm">{data.length} projects</p></div>
                <button onClick={() => { setEditing({ ...BLANK_RESEARCH }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Project</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="space-y-3">
                    {data.map(p => (
                        <div key={p._id} className="glass-card p-4 flex items-start gap-4 hover:border-primary-500/20 transition-all">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`badge text-xs ${p.status === 'ongoing' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-300'}`}>{p.status}</span>
                                    <span className="badge bg-white/10 text-white/40 text-xs">{p.domain}</span>
                                    <span className="text-white/25 text-xs">{p.year}</span>
                                </div>
                                <div className="font-medium text-white text-sm">{p.title}</div>
                                <div className="text-xs text-white/35 mt-1">👨‍🏫 {p.facultyGuide} {p.fundingAgency && `· 🏛 ${p.fundingAgency}`}</div>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                                <button onClick={() => { setEditing({ ...p, teamMembers: Array.isArray(p.teamMembers) ? p.teamMembers.join(', ') : p.teamMembers }); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm glass-card">No projects yet — click Add Project</div>}
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Research Project' : 'Edit Project'} onClose={() => setModal(null)}>
                        <Field label="Title *"><input className={inputCls} value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Project title" /></Field>
                        <Field label="Faculty Guide *"><input className={inputCls} value={editing.facultyGuide || ''} onChange={e => setEditing({ ...editing, facultyGuide: e.target.value })} placeholder="Dr. Name" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Domain"><select className={inputCls} value={editing.domain} onChange={e => setEditing({ ...editing, domain: e.target.value })}>{DOMAINS.map(d => <option key={d} value={d} className="bg-dark-900">{d}</option>)}</select></Field>
                            <Field label="Status"><select className={inputCls} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}><option value="ongoing" className="bg-dark-900">Ongoing</option><option value="completed" className="bg-dark-900">Completed</option></select></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Year"><input type="number" className={inputCls} value={editing.year} onChange={e => setEditing({ ...editing, year: Number(e.target.value) })} /></Field>
                            <Field label="Funded Amount"><input className={inputCls} value={editing.fundedAmount || ''} onChange={e => setEditing({ ...editing, fundedAmount: e.target.value })} placeholder="₹5 Lakhs" /></Field>
                        </div>
                        <Field label="Funding Agency"><input className={inputCls} value={editing.fundingAgency || ''} onChange={e => setEditing({ ...editing, fundingAgency: e.target.value })} placeholder="VTU / DST-SERB / DRDO" /></Field>
                        <Field label="Team Members (comma-separated)"><input className={inputCls} value={editing.teamMembers || ''} onChange={e => setEditing({ ...editing, teamMembers: e.target.value })} placeholder="Student A, Student B" /></Field>
                        <Field label="Description"><textarea className={inputCls} rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Project description…" /></Field>
                        <Field label="Research Paper URL"><input className={inputCls} value={editing.paperUrl || ''} onChange={e => setEditing({ ...editing, paperUrl: e.target.value })} placeholder="https://…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Project?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This project will be permanently deleted.</p>
                        <div className="flex gap-3">
                            <button onClick={() => del(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors">Delete</button>
                            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── PUBLICATIONS MODULE ──────────────────────────────────────────────────────
const BLANK_PUB = { title: '', authors: '', journal: '', year: new Date().getFullYear(), downloadUrl: '' };

export function PublicationsModule() {
    const [data, setData] = useState<any[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(BLANK_PUB);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/publications'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function save() {
        if (!editing.title?.trim() || !editing.authors?.trim()) { toast.error('Title and authors required'); return; }
        try {
            if (modal === 'add') { await apiReq('/publications', 'POST', editing); toast.success('Publication added!'); }
            else { await apiReq(`/publications/${editing._id}`, 'PUT', editing); toast.success('Updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error'); }
    }

    async function del(id: string) {
        try { await apiReq(`/publications/${id}`, 'DELETE'); toast.success('Deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message); }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Publications</h1><p className="text-white/35 text-sm">{data.length} papers</p></div>
                <button onClick={() => { setEditing({ ...BLANK_PUB }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Publication</button>
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/40 font-medium">Title</th>
                            <th className="text-left p-4 text-white/40 font-medium hidden md:table-cell">Journal</th>
                            <th className="text-left p-4 text-white/40 font-medium hidden lg:table-cell">Year</th>
                            <th className="text-right p-4 text-white/40 font-medium">Actions</th>
                        </tr></thead>
                        <tbody>
                            {data.map(p => (
                                <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="p-4"><div className="font-medium text-white text-sm">{p.title}</div><div className="text-xs text-white/35">{p.authors}</div></td>
                                    <td className="p-4 text-white/55 hidden md:table-cell text-xs">{p.journal}</td>
                                    <td className="p-4 text-white/55 hidden lg:table-cell">{p.year}</td>
                                    <td className="p-4"><div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditing(p); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No publications yet</div>}
                </div>
            )}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Publication' : 'Edit Publication'} onClose={() => setModal(null)}>
                        <Field label="Paper Title *"><input className={inputCls} value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Paper title…" /></Field>
                        <Field label="Authors *"><input className={inputCls} value={editing.authors || ''} onChange={e => setEditing({ ...editing, authors: e.target.value })} placeholder="Author A, Author B, et al." /></Field>
                        <Field label="Journal / Conference"><input className={inputCls} value={editing.journal || ''} onChange={e => setEditing({ ...editing, journal: e.target.value })} placeholder="IEEE Transactions on…" /></Field>
                        <Field label="Year"><input type="number" className={inputCls} value={editing.year} onChange={e => setEditing({ ...editing, year: Number(e.target.value) })} /></Field>
                        <Field label="Download URL (PDF)"><input className={inputCls} value={editing.downloadUrl || ''} onChange={e => setEditing({ ...editing, downloadUrl: e.target.value })} placeholder="https://…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Publication?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This publication will be permanently deleted.</p>
                        <div className="flex gap-3">
                            <button onClick={() => del(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm">Delete</button>
                            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
