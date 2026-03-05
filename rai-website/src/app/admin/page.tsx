'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiShield, FiEye, FiEyeOff, FiAlertCircle, FiLogOut,
    FiTrendingUp, FiUsers, FiBell, FiImage, FiBook,
    FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCheckCircle,
    FiMenu,
} from 'react-icons/fi';

// ─── AUTH ────────────────────────────────────────────────────────────────────
type AdminUser = { name: string; role: string; email: string };
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiReq(path: string, method = 'GET', body?: object) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rai_token') : null;
    const res = await fetch(`${API}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Faculty = { id: string; name: string; designation: string; qualification: string; specialization: string; experience: number; email: string; researchAreas: string };
type Notice = { id: string; title: string; category: string; description: string; date: string; important: boolean };
type Event = { id: string; title: string; category: string; date: string; venue: string; description: string };
type Placement = { id: string; year: number; placed: number; total: number; highest: number; average: number; companies: string };

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const SEED_FACULTY: Faculty[] = [];
const SEED_NOTICES: Notice[] = [];
const SEED_EVENTS: Event[] = [];
const SEED_PLACEMENTS: Placement[] = [];

function loadLS<T>(key: string, seed: T[]): T[] {
    if (typeof window === 'undefined') return seed;
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : seed; } catch { return seed; }
}
function saveLS<T>(key: string, data: T[]) {
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data));
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
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
                    <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <label className="text-sm text-white/50 mb-1.5 block">{label}</label>
            {children}
        </div>
    );
}
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors text-sm";

// ─── FACULTY MODULE ───────────────────────────────────────────────────────────
const BLANK_FACULTY: Faculty = { id: '', name: '', designation: '', qualification: '', specialization: '', experience: 0, email: '', researchAreas: '' };

function FacultyModule() {
    const [data, setData] = useState<Faculty[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Faculty>(BLANK_FACULTY);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { setData(loadLS('admin_faculty', SEED_FACULTY)); }, []);

    const save = () => {
        if (!editing.name.trim() || !editing.email.trim()) { toast.error('Name and email are required'); return; }
        let updated: Faculty[];
        if (modal === 'add') {
            updated = [...data, { ...editing, id: Date.now().toString() }];
            toast.success('Faculty member added!');
        } else {
            updated = data.map(f => f.id === editing.id ? editing : f);
            toast.success('Faculty updated!');
        }
        setData(updated); saveLS('admin_faculty', updated); setModal(null);
    };

    const del = (id: string) => {
        const updated = data.filter(f => f.id !== id);
        setData(updated); saveLS('admin_faculty', updated);
        toast.success('Faculty removed'); setDeleteId(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Faculty</h1><p className="text-white/35 text-sm">{data.length} members</p></div>
                <button onClick={() => { setEditing(BLANK_FACULTY); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Faculty</button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/40 font-medium">Name</th>
                        <th className="text-left p-4 text-white/40 font-medium hidden md:table-cell">Designation</th>
                        <th className="text-left p-4 text-white/40 font-medium hidden lg:table-cell">Specialization</th>
                        <th className="text-left p-4 text-white/40 font-medium hidden lg:table-cell">Exp. (Yrs)</th>
                        <th className="text-right p-4 text-white/40 font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                        {data.map(f => (
                            <tr key={f.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {f.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div><div className="text-white font-medium">{f.name}</div><div className="text-xs text-white/35">{f.email}</div></div>
                                    </div>
                                </td>
                                <td className="p-4 text-white/55 hidden md:table-cell">{f.designation}</td>
                                <td className="p-4 hidden lg:table-cell"><span className="badge bg-primary-500/20 text-primary-300 text-xs">{f.specialization}</span></td>
                                <td className="p-4 text-white/55 hidden lg:table-cell">{f.experience}</td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditing(f); setModal('edit'); }}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(f.id)}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No faculty yet — click Add Faculty</div>}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Faculty Member' : 'Edit Faculty Member'} onClose={() => setModal(null)}>
                        <Field label="Full Name *"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Dr. Full Name" /></Field>
                        <Field label="Designation *"><input className={inputCls} value={editing.designation} onChange={e => setEditing({ ...editing, designation: e.target.value })} placeholder="Professor & HOD" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Qualification"><input className={inputCls} value={editing.qualification} onChange={e => setEditing({ ...editing, qualification: e.target.value })} placeholder="Ph.D" /></Field>
                            <Field label="Specialization"><input className={inputCls} value={editing.specialization} onChange={e => setEditing({ ...editing, specialization: e.target.value })} placeholder="Robotics" /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Experience (Yrs)"><input type="number" className={inputCls} value={editing.experience} onChange={e => setEditing({ ...editing, experience: Number(e.target.value) })} /></Field>
                            <Field label="Email *"><input type="email" className={inputCls} value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="name@jnnce.ac.in" /></Field>
                        </div>
                        <Field label="Research Areas (comma-separated)"><input className={inputCls} value={editing.researchAreas} onChange={e => setEditing({ ...editing, researchAreas: e.target.value })} placeholder="Robotics, Computer Vision" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add Member' : 'Save Changes'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}

                {deleteId && (
                    <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">Are you sure you want to remove this faculty member? This cannot be undone.</p>
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

// ─── NOTICES MODULE ───────────────────────────────────────────────────────────
const BLANK_NOTICE: Notice = { id: '', title: '', category: 'General', description: '', date: new Date().toISOString().split('T')[0], important: false };
const NOTICE_CATS = ['General', 'Exam', 'Event', 'Scholarship', 'Holiday', 'Placement', 'Result'];
const catColors: Record<string, string> = { Exam: 'bg-red-500/20 text-red-300', Event: 'bg-blue-500/20 text-blue-300', Scholarship: 'bg-yellow-500/20 text-yellow-300', Holiday: 'bg-green-500/20 text-green-300', Placement: 'bg-purple-500/20 text-purple-300', Result: 'bg-orange-500/20 text-orange-300', General: 'bg-white/10 text-white/50' };

function NoticesModule() {
    const [data, setData] = useState<Notice[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Notice>(BLANK_NOTICE);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { setData(loadLS('admin_notices', SEED_NOTICES)); }, []);

    const save = () => {
        if (!editing.title.trim()) { toast.error('Title is required'); return; }
        let updated: Notice[];
        if (modal === 'add') {
            updated = [{ ...editing, id: Date.now().toString() }, ...data];
            toast.success('Notice published!');
        } else {
            updated = data.map(n => n.id === editing.id ? editing : n);
            toast.success('Notice updated!');
        }
        setData(updated); saveLS('admin_notices', updated); setModal(null);
    };

    const del = (id: string) => {
        const updated = data.filter(n => n.id !== id);
        setData(updated); saveLS('admin_notices', updated);
        toast.success('Notice deleted'); setDeleteId(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Notices</h1><p className="text-white/35 text-sm">{data.length} notices</p></div>
                <button onClick={() => { setEditing({ ...BLANK_NOTICE, date: new Date().toISOString().split('T')[0] }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Notice</button>
            </div>

            <div className="space-y-3">
                {data.map(n => (
                    <div key={n.id} className="glass-card p-4 flex items-start gap-4 hover:border-primary-500/20 transition-all">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`badge text-xs ${catColors[n.category] || catColors.General}`}>{n.category}</span>
                                {n.important && <span className="badge bg-red-500/20 text-red-300 text-xs">⚠ Important</span>}
                            </div>
                            <div className="font-medium text-white text-sm">{n.title}</div>
                            <div className="text-xs text-white/35 mt-1">{n.description.slice(0, 100)}{n.description.length > 100 ? '…' : ''}</div>
                            <div className="text-xs text-white/25 mt-1">📅 {n.date}</div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                            <button onClick={() => { setEditing(n); setModal('edit'); }}
                                className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteId(n.id)}
                                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm glass-card">No notices yet — click Add Notice</div>}
            </div>

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Publish Notice' : 'Edit Notice'} onClose={() => setModal(null)}>
                        <Field label="Title *"><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Notice title…" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Category">
                                <select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                    {NOTICE_CATS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Date"><input type="date" className={inputCls} value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></Field>
                        </div>
                        <Field label="Description"><textarea className={inputCls} rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Notice details…" /></Field>
                        <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
                            <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${editing.important ? 'bg-red-500' : 'bg-white/10'}`}
                                onClick={() => setEditing({ ...editing, important: !editing.important })}>
                                <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${editing.important ? 'translate-x-5' : ''}`} />
                            </div>
                            <span className="text-sm text-white/60">Mark as Important</span>
                        </label>
                        <div className="flex gap-3">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Publish' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Notice?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This notice will be permanently removed.</p>
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

// ─── EVENTS MODULE ────────────────────────────────────────────────────────────
const BLANK_EVENT: Event = { id: '', title: '', category: 'Technical', date: new Date().toISOString().split('T')[0], venue: '', description: '' };
const EVENT_CATS = ['Technical', 'Hackathon', 'Lecture', 'Workshop', 'Cultural', 'Sports', 'Seminar'];

function EventsModule() {
    const [data, setData] = useState<Event[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Event>(BLANK_EVENT);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { setData(loadLS('admin_events', SEED_EVENTS)); }, []);

    const save = () => {
        if (!editing.title.trim()) { toast.error('Title is required'); return; }
        let updated: Event[];
        if (modal === 'add') {
            updated = [{ ...editing, id: Date.now().toString() }, ...data];
            toast.success('Event created!');
        } else {
            updated = data.map(e => e.id === editing.id ? editing : e);
            toast.success('Event updated!');
        }
        setData(updated); saveLS('admin_events', updated); setModal(null);
    };

    const del = (id: string) => {
        const updated = data.filter(e => e.id !== id);
        setData(updated); saveLS('admin_events', updated);
        toast.success('Event removed'); setDeleteId(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Events</h1><p className="text-white/35 text-sm">{data.length} events</p></div>
                <button onClick={() => { setEditing({ ...BLANK_EVENT, date: new Date().toISOString().split('T')[0] }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Event</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {data.map(ev => (
                    <div key={ev.id} className="glass-card p-5 hover:border-primary-500/20 transition-all group">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <span className="badge bg-primary-500/20 text-primary-300 text-xs mb-2">{ev.category}</span>
                                <h3 className="font-semibold text-white text-sm mb-1">{ev.title}</h3>
                                <div className="text-xs text-white/35">📅 {ev.date} &nbsp;|&nbsp; 📍 {ev.venue}</div>
                                <p className="text-xs text-white/40 mt-2 leading-relaxed">{ev.description.slice(0, 80)}{ev.description.length > 80 ? '…' : ''}</p>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditing(ev); setModal('edit'); }}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteId(ev.id)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && <div className="col-span-2 text-center py-12 text-white/25 text-sm glass-card">No events yet — click Add Event</div>}
            </div>

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Create Event' : 'Edit Event'} onClose={() => setModal(null)}>
                        <Field label="Event Title *"><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Event name…" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Category">
                                <select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                    {EVENT_CATS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Date"><input type="date" className={inputCls} value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></Field>
                        </div>
                        <Field label="Venue"><input className={inputCls} value={editing.venue} onChange={e => setEditing({ ...editing, venue: e.target.value })} placeholder="e.g. AICTE-IDEA Lab, JNNCE" /></Field>
                        <Field label="Description"><textarea className={inputCls} rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Event details…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Create' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Event?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This event will be permanently removed.</p>
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

// ─── PLACEMENTS MODULE ────────────────────────────────────────────────────────
const BLANK_PLACEMENT: Placement = { id: '', year: new Date().getFullYear(), placed: 0, total: 60, highest: 0, average: 0, companies: '' };

function PlacementsModule() {
    const [data, setData] = useState<Placement[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Placement>(BLANK_PLACEMENT);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { setData(loadLS('admin_placements', SEED_PLACEMENTS)); }, []);

    const save = () => {
        if (!editing.year) { toast.error('Year is required'); return; }
        let updated: Placement[];
        if (modal === 'add') {
            updated = [{ ...editing, id: Date.now().toString() }, ...data];
            toast.success('Placement record added!');
        } else {
            updated = data.map(p => p.id === editing.id ? editing : p);
            toast.success('Placement updated!');
        }
        setData(updated); saveLS('admin_placements', updated); setModal(null);
    };

    const del = (id: string) => {
        const updated = data.filter(p => p.id !== id);
        setData(updated); saveLS('admin_placements', updated);
        toast.success('Record deleted'); setDeleteId(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Placements</h1><p className="text-white/35 text-sm">Year-wise data</p></div>
                <button onClick={() => { setEditing(BLANK_PLACEMENT); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Year</button>
            </div>

            <div className="glass-card overflow-x-auto">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                        {['Year', 'Total', 'Placed', 'Rate', 'Highest (LPA)', 'Avg (LPA)', 'Top Companies', ''].map(h => (
                            <th key={h} className="text-left p-4 text-white/40 font-medium whitespace-nowrap">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {[...data].sort((a, b) => b.year - a.year).map(p => (
                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                <td className="p-4 font-bold text-white">{p.year}</td>
                                <td className="p-4 text-white/55">{p.total}</td>
                                <td className="p-4 text-white/55">{p.placed}</td>
                                <td className="p-4"><span className="badge bg-accent-500/20 text-accent-400 text-xs">{Math.round((p.placed / p.total) * 100)}%</span></td>
                                <td className="p-4 text-yellow-400 font-semibold">{p.highest} LPA</td>
                                <td className="p-4 text-primary-400 font-semibold">{p.average} LPA</td>
                                <td className="p-4 text-white/40 max-w-[180px] truncate">{p.companies}</td>
                                <td className="p-4">
                                    <div className="flex gap-1.5">
                                        <button onClick={() => { setEditing(p); setModal('edit'); }}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(p.id)}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No records yet</div>}
            </div>

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Placement Year' : 'Edit Placement Record'} onClose={() => setModal(null)}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Year *"><input type="number" className={inputCls} value={editing.year} onChange={e => setEditing({ ...editing, year: Number(e.target.value) })} /></Field>
                            <Field label="Total Students"><input type="number" className={inputCls} value={editing.total} onChange={e => setEditing({ ...editing, total: Number(e.target.value) })} /></Field>
                            <Field label="Students Placed"><input type="number" className={inputCls} value={editing.placed} onChange={e => setEditing({ ...editing, placed: Number(e.target.value) })} /></Field>
                            <Field label="Highest Package (LPA)"><input type="number" step="0.1" className={inputCls} value={editing.highest} onChange={e => setEditing({ ...editing, highest: Number(e.target.value) })} /></Field>
                            <Field label="Average Package (LPA)"><input type="number" step="0.1" className={inputCls} value={editing.average} onChange={e => setEditing({ ...editing, average: Number(e.target.value) })} /></Field>
                        </div>
                        <Field label="Top Recruiting Companies (comma-separated)">
                            <input className={inputCls} value={editing.companies} onChange={e => setEditing({ ...editing, companies: e.target.value })} placeholder="ABB, Bosch, Infosys, TCS" />
                        </Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add Record' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Record?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This placement record will be permanently deleted.</p>
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

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function OverviewTab({ setTab }: { setTab: (t: string) => void }) {
    const [counts, setCounts] = useState({ faculty: 0, notices: 0, events: 0, placements: 0 });
    useEffect(() => {
        setCounts({
            faculty: loadLS('admin_faculty', SEED_FACULTY).length,
            notices: loadLS('admin_notices', SEED_NOTICES).length,
            events: loadLS('admin_events', SEED_EVENTS).length,
            placements: loadLS('admin_placements', SEED_PLACEMENTS).length,
        });
    }, []);

    return (
        <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">Dashboard</h1>
            <p className="text-white/35 mb-8">RAI JNNCE · Content Management System</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Faculty', value: counts.faculty, icon: '👨‍🏫', color: 'text-primary-300', tab: 'faculty' },
                    { label: 'Notices', value: counts.notices, icon: '📢', color: 'text-red-300', tab: 'notices' },
                    { label: 'Events', value: counts.events, icon: '📅', color: 'text-blue-300', tab: 'events' },
                    { label: 'Placement Records', value: counts.placements, icon: '📊', color: 'text-accent-300', tab: 'placements' },
                ].map(k => (
                    <motion.div key={k.label} whileHover={{ scale: 1.02 }} onClick={() => setTab(k.tab)}
                        className="glass-card p-5 cursor-pointer hover:border-primary-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{k.icon}</span>
                            <span className={`text-3xl font-bold ${k.color}`}>{k.value}</span>
                        </div>
                        <div className="text-sm text-white/45">{k.label}</div>
                        <div className="text-xs text-white/20 flex items-center gap-1 mt-1">Click to manage →</div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        { label: 'Add Faculty Profile', emoji: '👨‍🏫', tab: 'faculty' },
                        { label: 'Publish New Notice', emoji: '📢', tab: 'notices' },
                        { label: 'Create Event', emoji: '📅', tab: 'events' },
                        { label: 'Update Placement Data', emoji: '📊', tab: 'placements' },
                    ].map(a => (
                        <button key={a.tab} onClick={() => setTab(a.tab)}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/4 border border-white/8 hover:bg-primary-500/8 hover:border-primary-500/25 transition-all text-left">
                            <span className="text-2xl">{a.emoji}</span>
                            <div className="text-sm font-medium text-white/70">{a.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card p-5 mt-5">
                <h3 className="font-semibold text-white text-sm mb-4">Data Storage</h3>
                <p className="text-xs text-white/40 mb-3">All changes are saved to your browser&apos;s localStorage instantly. Connect the backend to persist data in MongoDB.</p>
                <div className="flex items-center gap-2 text-xs text-accent-400 font-medium">
                    <FiCheckCircle className="w-4 h-4" /> Auto-save enabled (localStorage)
                </div>
            </div>
        </div>
    );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'rai@jnnce.ac.in';
const ADMIN_PASS = 'rai#@123';

function LoginScreen({ onLogin }: { onLogin: (u: AdminUser) => void }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');

        // Attempt API login first
        try {
            const data = await apiReq('/auth/login', 'POST', form);
            const user = data.user || data.data;
            localStorage.setItem('rai_token', data.token);
            localStorage.setItem('rai_user', JSON.stringify(user));
            onLogin(user);
            toast.success(`Welcome, ${user.name}!`);
        } catch {
            // Fallback to local hardcoded check if API fails or backend is unreachable
            if (form.email.toLowerCase().trim() === ADMIN_EMAIL && form.password === ADMIN_PASS) {
                const u: AdminUser = { name: 'RAI Admin', role: 'super_admin', email: form.email };
                localStorage.setItem('rai_token', 'local_admin_token');
                localStorage.setItem('rai_user', JSON.stringify(u));
                onLogin(u);
                toast.success('Welcome, RAI Admin!');
            } else {
                setError('Invalid credentials. Check email and password.');
            }
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(135deg, #060614, #0d0d2b 50%, #071422)' }}>
            <div className="orb w-64 h-64 bg-primary-800" style={{ top: '-50px', right: '10%' }} />
            <div className="orb w-48 h-48 bg-accent-800" style={{ bottom: '80px', left: '10%', animationDelay: '2s' }} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
                <div className="glass-card p-8 border border-white/15">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow mx-auto mb-4">
                            <FiShield className="text-white w-8 h-8" />
                        </div>
                        <h1 className="font-display font-bold text-2xl text-white">Admin Portal</h1>
                        <p className="text-white/40 text-sm mt-1">Dept. of RAI · JNNCE, Shivamogga</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
                                <FiAlertCircle className="flex-shrink-0 w-4 h-4" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Email</label>
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" required
                                placeholder="rai@jnnce.ac.in" autoComplete="email" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Password</label>
                            <div className="relative">
                                <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    type={showPw ? 'text' : 'password'} required placeholder="••••••••" autoComplete="current-password"
                                    className={`${inputCls} pr-11`} />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
                            {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</span> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
const navItems = [
    { key: 'overview', icon: <FiTrendingUp />, label: 'Overview' },
    { key: 'faculty', icon: <FiUsers />, label: 'Faculty' },
    { key: 'notices', icon: <FiBell />, label: 'Notices' },
    { key: 'events', icon: <FiImage />, label: 'Events' },
    { key: 'placements', icon: <FiBook />, label: 'Placements' },
];

function AdminShell({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
    const [tab, setTab] = useState('overview');
    const [sideOpen, setSideOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-dark-900/98 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-glow">R</div>
                    <div><div className="text-xs font-bold text-white leading-tight">RAI Admin</div><div className="text-xs text-white/30">JNNCE</div></div>
                </div>

                <div className="m-3 p-3 rounded-xl bg-white/5 border border-white/8">
                    <div className="text-xs text-white/30">Signed in as</div>
                    <div className="font-semibold text-white text-sm">{user.name}</div>
                    <span className="badge bg-primary-500/20 text-primary-300 text-xs mt-1">Super Admin</span>
                </div>

                <nav className="flex-1 px-2 space-y-1">
                    {navItems.map(item => (
                        <button key={item.key} onClick={() => { setTab(item.key); setSideOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${tab === item.key ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/8">
                    <button onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                        <FiLogOut /> Sign Out
                    </button>
                </div>
            </aside>

            {sideOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />}

            <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
                <header className="sticky top-0 z-20 h-14 bg-dark-900/90 backdrop-blur-xl border-b border-white/10 flex items-center px-4 gap-3">
                    <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white">
                        <FiMenu className="w-5 h-5" />
                    </button>
                    <div className="text-sm text-white/40 capitalize">{navItems.find(n => n.key === tab)?.label}</div>
                    <div className="ml-auto text-xs text-accent-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /> Auto-save ON
                    </div>
                </header>

                <main className="flex-1 p-5 lg:p-8 max-w-6xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                            {tab === 'overview' && <OverviewTab setTab={setTab} />}
                            {tab === 'faculty' && <FacultyModule />}
                            {tab === 'notices' && <NoticesModule />}
                            {tab === 'events' && <EventsModule />}
                            {tab === 'placements' && <PlacementsModule />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
export default function AdminPage() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const s = localStorage.getItem('rai_user');
            if (s) setUser(JSON.parse(s));
        } catch { }
        setReady(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('rai_token');
        localStorage.removeItem('rai_user');
        setUser(null);
        toast.success('Signed out');
    }, []);

    if (!ready) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
    );

    return user
        ? <AdminShell user={user} onLogout={logout} />
        : <LoginScreen onLogin={setUser} />;
}
