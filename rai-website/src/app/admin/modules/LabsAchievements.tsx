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

// ── LABS MODULE ──────────────────────────────────────────────────────────────
const BLANK_LAB = { name: '', description: '', equipment: '', images: '' };

export function LabsModule() {
    const [data, setData] = useState<any[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(BLANK_LAB);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/labs'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function save() {
        if (!editing.name?.trim()) { toast.error('Name required'); return; }
        try {
            const payload = {
                ...editing,
                equipment: editing.equipment ? editing.equipment.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
                images: editing.images ? editing.images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
            };
            if (modal === 'add') { await apiReq('/labs', 'POST', payload); toast.success('Lab added!'); }
            else { await apiReq(`/labs/${editing._id}`, 'PUT', payload); toast.success('Lab updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error'); }
    }

    async function del(id: string) {
        try { await apiReq(`/labs/${id}`, 'DELETE'); toast.success('Deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message); }
    }

    const prepareEdit = (lab: any) => ({
        ...lab,
        equipment: Array.isArray(lab.equipment) ? lab.equipment.join('\n') : lab.equipment,
        images: Array.isArray(lab.images) ? lab.images.join('\n') : lab.images,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Laboratories</h1><p className="text-white/35 text-sm">{data.length} labs</p></div>
                <button onClick={() => { setEditing({ ...BLANK_LAB }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Lab</button>
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 gap-4">
                    {data.map(lab => (
                        <div key={lab._id} className="glass-card p-5 hover:border-primary-500/20 transition-all group">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white text-sm mb-1">{lab.name}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed">{lab.description?.slice(0, 80)}{lab.description?.length > 80 ? '…' : ''}</p>
                                    {lab.equipment?.length > 0 && <p className="text-xs text-white/25 mt-2">{lab.equipment.length} equipment items</p>}
                                </div>
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditing(prepareEdit(lab)); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteId(lab._id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-2 text-center py-12 text-white/25 text-sm glass-card">No labs yet</div>}
                </div>
            )}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Laboratory' : 'Edit Laboratory'} onClose={() => setModal(null)}>
                        <Field label="Lab Name *"><input className={inputCls} value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. AI & ML Research Lab" /></Field>
                        <Field label="Description"><textarea className={inputCls} rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Lab description…" /></Field>
                        <Field label="Equipment (one per line)"><textarea className={inputCls} rows={4} value={editing.equipment || ''} onChange={e => setEditing({ ...editing, equipment: e.target.value })} placeholder="GPU Workstation&#10;NVIDIA Jetson Nano&#10;RoboMaster S1" /></Field>
                        <Field label="Image URLs (one per line)"><textarea className={inputCls} rows={3} value={editing.images || ''} onChange={e => setEditing({ ...editing, images: e.target.value })} placeholder="https://…&#10;https://…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Lab?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This lab will be permanently deleted.</p>
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

// ── ACHIEVEMENTS MODULE ──────────────────────────────────────────────────────
const BLANK_ACH = { studentName: '', achievementTitle: '', eventName: '', awardRank: '', year: new Date().getFullYear() };

export function AchievementsModule() {
    const [data, setData] = useState<any[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(BLANK_ACH);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/achievements'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function save() {
        if (!editing.studentName?.trim() || !editing.achievementTitle?.trim()) { toast.error('Student name and title required'); return; }
        try {
            if (modal === 'add') { await apiReq('/achievements', 'POST', editing); toast.success('Achievement added!'); }
            else { await apiReq(`/achievements/${editing._id}`, 'PUT', editing); toast.success('Updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error'); }
    }

    async function del(id: string) {
        try { await apiReq(`/achievements/${id}`, 'DELETE'); toast.success('Deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message); }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Achievements</h1><p className="text-white/35 text-sm">{data.length} entries</p></div>
                <button onClick={() => { setEditing({ ...BLANK_ACH }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Achievement</button>
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/40 font-medium">Student</th>
                            <th className="text-left p-4 text-white/40 font-medium hidden md:table-cell">Achievement</th>
                            <th className="text-left p-4 text-white/40 font-medium hidden lg:table-cell">Year</th>
                            <th className="text-right p-4 text-white/40 font-medium">Actions</th>
                        </tr></thead>
                        <tbody>
                            {data.map(a => (
                                <tr key={a._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="p-4"><div className="font-medium text-white">{a.studentName}</div>{a.awardRank && <div className="text-xs text-cyber">{a.awardRank}</div>}</td>
                                    <td className="p-4 hidden md:table-cell"><div className="text-white/70 text-sm">{a.achievementTitle}</div>{a.eventName && <div className="text-xs text-white/35">{a.eventName}</div>}</td>
                                    <td className="p-4 text-white/55 hidden lg:table-cell">{a.year}</td>
                                    <td className="p-4"><div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditing(a); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(a._id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No achievements yet</div>}
                </div>
            )}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Achievement' : 'Edit Achievement'} onClose={() => setModal(null)}>
                        <Field label="Student Name *"><input className={inputCls} value={editing.studentName || ''} onChange={e => setEditing({ ...editing, studentName: e.target.value })} placeholder="Student full name" /></Field>
                        <Field label="Achievement Title *"><input className={inputCls} value={editing.achievementTitle || ''} onChange={e => setEditing({ ...editing, achievementTitle: e.target.value })} placeholder="1st Prize in Robotics Competition" /></Field>
                        <Field label="Event Name"><input className={inputCls} value={editing.eventName || ''} onChange={e => setEditing({ ...editing, eventName: e.target.value })} placeholder="Robothon 2024" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Award / Rank"><input className={inputCls} value={editing.awardRank || ''} onChange={e => setEditing({ ...editing, awardRank: e.target.value })} placeholder="Gold Medal" /></Field>
                            <Field label="Year"><input type="number" className={inputCls} value={editing.year} onChange={e => setEditing({ ...editing, year: Number(e.target.value) })} /></Field>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Achievement?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This entry will be permanently deleted.</p>
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
