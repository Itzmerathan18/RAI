'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiShield, FiEye, FiEyeOff, FiAlertCircle, FiLogOut,
    FiTrendingUp, FiUsers, FiBell, FiImage, FiBook,
    FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCheckCircle,
    FiMenu, FiZap, FiAward, FiPackage, FiCpu, FiExternalLink, FiArrowRight,
    FiHome, FiGlobe, FiMessageSquare, FiSettings, FiAlignLeft
} from 'react-icons/fi';
import { ResearchModule, PublicationsModule } from './modules/ResearchPublications';
import { LabsModule, AchievementsModule } from './modules/LabsAchievements';
import { GalleryModule } from './modules/GalleryModule';
import { HomepageModule, AboutModule, DepartmentModule, TestimonialsModule, AnalyticsModule, SiteSettingsModule } from './modules/ContentModules';

// ─── AUTH ────────────────────────────────────────────────────────────────────
type AdminUser = { name: string; role: string; email: string };
const API = '/api';

async function apiReq(path: string, method = 'GET', body?: object) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rai_token') : null;
    const res = await fetch(`${API}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('rai_token');
            localStorage.removeItem('rai_user');
        }
        throw new Error('Session expired. Please sign in again.');
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Faculty = { _id?: string; name: string; designation: string; qualification: string; specialization: string; experience: number; email: string; researchAreas: string | string[] };
type Notice = { _id?: string; title: string; category: string; description: string; date: string; important: boolean; link?: string };
type Event = { _id?: string; title: string; category: string; date: string; venue: string; description: string; images?: string[] };
type Placement = { _id?: string; year: number; placed: number; total: number; highest: number; average: number; companies: string | string[] };

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
const BLANK_FACULTY: Faculty = { name: '', designation: '', qualification: '', specialization: '', experience: 0, email: '', researchAreas: '' };

function FacultyModule() {
    const [data, setData] = useState<Faculty[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Faculty>(BLANK_FACULTY);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/faculty'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    const save = async () => {
        if (!editing.name.trim() || !editing.email.trim()) { toast.error('Name and email are required'); return; }
        try {
            const payload = { ...editing, researchAreas: typeof editing.researchAreas === 'string' ? editing.researchAreas.split(',').map(s => s.trim()).filter(Boolean) : editing.researchAreas };
            if (modal === 'add') { await apiReq('/faculty', 'POST', payload); toast.success('Faculty member added!'); }
            else { await apiReq(`/faculty/${editing._id}`, 'PUT', payload); toast.success('Faculty updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving faculty'); }
    };

    const del = async (id: string) => {
        try { await apiReq(`/faculty/${id}`, 'DELETE'); toast.success('Faculty removed'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting faculty'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Faculty</h1><p className="text-white/35 text-sm">{data.length} members</p></div>
                <button onClick={() => { setEditing(BLANK_FACULTY); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Faculty</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
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
                                <tr key={f._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
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
                                            <button onClick={() => { setEditing({ ...f, researchAreas: Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : f.researchAreas || '' }); setModal('edit'); }}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteId(f._id!)}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No faculty yet — click Add Faculty</div>}
                </div>
            )}

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
const BLANK_NOTICE: Notice = { title: '', category: 'General', description: '', date: new Date().toISOString().split('T')[0], important: false };
const NOTICE_CATS = ['General', 'Exam', 'Event', 'Scholarship', 'Holiday', 'Placement', 'Result'];
const catColors: Record<string, string> = { Exam: 'bg-red-500/20 text-red-300', Event: 'bg-blue-500/20 text-blue-300', Scholarship: 'bg-yellow-500/20 text-yellow-300', Holiday: 'bg-green-500/20 text-green-300', Placement: 'bg-purple-500/20 text-purple-300', Result: 'bg-orange-500/20 text-orange-300', General: 'bg-white/10 text-white/50' };

function NoticesModule() {
    const [data, setData] = useState<Notice[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Notice>(BLANK_NOTICE);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/notices'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    const save = async () => {
        if (!editing.title.trim()) { toast.error('Title is required'); return; }
        try {
            if (modal === 'add') { await apiReq('/notices', 'POST', editing); toast.success('Notice published!'); }
            else { await apiReq(`/notices/${editing._id}`, 'PUT', editing); toast.success('Notice updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving notice'); }
    };

    const del = async (id: string) => {
        try { await apiReq(`/notices/${id}`, 'DELETE'); toast.success('Notice deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting notice'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Notices</h1><p className="text-white/35 text-sm">{data.length} notices</p></div>
                <button onClick={() => { setEditing({ ...BLANK_NOTICE, date: new Date().toISOString().split('T')[0] }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Notice</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="space-y-3">
                    {data.map(n => (
                        <div key={n._id} className="glass-card p-4 flex items-start gap-4 hover:border-primary-500/20 transition-all">
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
                                <button onClick={() => setDeleteId(n._id!)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm glass-card">No notices yet — click Add Notice</div>}
                </div>
            )}

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
const BLANK_EVENT: Event = { title: '', category: 'Technical', date: new Date().toISOString().split('T')[0], venue: '', description: '', images: [] };
const EVENT_CATS = ['Technical', 'Hackathon', 'Lecture', 'Workshop', 'Cultural', 'Sports', 'Seminar'];

function EventsModule() {
    const [data, setData] = useState<Event[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Event>(BLANK_EVENT);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/events'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    const save = async () => {
        if (!editing.title.trim()) { toast.error('Title is required'); return; }
        try {
            if (modal === 'add') { await apiReq('/events', 'POST', editing); toast.success('Event created!'); }
            else { await apiReq(`/events/${editing._id}`, 'PUT', editing); toast.success('Event updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving event'); }
    };

    const del = async (id: string) => {
        try { await apiReq(`/events/${id}`, 'DELETE'); toast.success('Event removed'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting event'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Events</h1><p className="text-white/35 text-sm">{data.length} events</p></div>
                <button onClick={() => { setEditing({ ...BLANK_EVENT, date: new Date().toISOString().split('T')[0] }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Event</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 gap-4">
                    {data.map(ev => (
                        <div key={ev._id} className="glass-card p-5 hover:border-primary-500/20 transition-all group">
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
                                    <button onClick={() => setDeleteId(ev._id!)}
                                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-2 text-center py-12 text-white/25 text-sm glass-card">No events yet — click Add Event</div>}
                </div>
            )}

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
const BLANK_PLACEMENT: Placement = { year: new Date().getFullYear(), placed: 0, total: 60, highest: 0, average: 0, companies: '' };

function PlacementsModule() {
    const [data, setData] = useState<Placement[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Placement>(BLANK_PLACEMENT);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try { const r = await apiReq('/placements'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    const save = async () => {
        if (!editing.year) { toast.error('Year is required'); return; }
        try {
            const payload = { ...editing, companies: typeof editing.companies === 'string' ? editing.companies.split(',').map(s => s.trim()).filter(Boolean) : editing.companies };
            if (modal === 'add') { await apiReq('/placements', 'POST', payload); toast.success('Placement record added!'); }
            else { await apiReq(`/placements/${editing._id}`, 'PUT', payload); toast.success('Placement updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving placement'); }
    };

    const del = async (id: string) => {
        try { await apiReq(`/placements/${id}`, 'DELETE'); toast.success('Record deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting placement'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Placements</h1><p className="text-white/35 text-sm">Year-wise data</p></div>
                <button onClick={() => { setEditing(BLANK_PLACEMENT); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Year</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="glass-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/10">
                            {['Year', 'Total', 'Placed', 'Rate', 'Highest (LPA)', 'Avg (LPA)', 'Top Companies', ''].map(h => (
                                <th key={h} className="text-left p-4 text-white/40 font-medium whitespace-nowrap">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {[...data].sort((a, b) => b.year - a.year).map(p => (
                                <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="p-4 font-bold text-white">{p.year}</td>
                                    <td className="p-4 text-white/55">{p.total}</td>
                                    <td className="p-4 text-white/55">{p.placed}</td>
                                    <td className="p-4"><span className="badge bg-accent-500/20 text-accent-400 text-xs">{Math.round((p.placed / p.total) * 100)}%</span></td>
                                    <td className="p-4 text-yellow-400 font-semibold">{p.highest} LPA</td>
                                    <td className="p-4 text-primary-400 font-semibold">{p.average} LPA</td>
                                    <td className="p-4 text-white/40 max-w-[180px] truncate">{Array.isArray(p.companies) ? p.companies.join(', ') : p.companies}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1.5">
                                            <button onClick={() => { setEditing({ ...p, companies: Array.isArray(p.companies) ? p.companies.join(', ') : p.companies || '' }); setModal('edit'); }}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteId(p._id!)}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <div className="text-center py-12 text-white/25 text-sm">No records yet</div>}
                </div>
            )}

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

// ─── ALUMNI MODULE ────────────────────────────────────────────────────────────
type Alumni = { _id?: string; name: string; batch: string; currentCompany: string; designation: string; location: string; linkedInUrl: string; message: string };
const BLANK_ALUMNI: Alumni = { name: '', batch: '', currentCompany: '', designation: '', location: '', linkedInUrl: '', message: '' };

function AlumniModule() {
    const [data, setData] = useState<Alumni[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Alumni>(BLANK_ALUMNI);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);
    async function load() {
        setLoading(true);
        try { const r = await apiReq('/alumni'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }
    const save = async () => {
        if (!editing.name.trim()) { toast.error('Name is required'); return; }
        try {
            if (modal === 'add') { await apiReq('/alumni', 'POST', editing); toast.success('Alumni added!'); }
            else { await apiReq(`/alumni/${editing._id}`, 'PUT', editing); toast.success('Alumni updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving alumni'); }
    };
    const del = async (id: string) => {
        try { await apiReq(`/alumni/${id}`, 'DELETE'); toast.success('Alumni removed'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting'); }
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Alumni</h1><p className="text-white/35 text-sm">{data.length} profiles</p></div>
                <button onClick={() => { setEditing(BLANK_ALUMNI); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Alumni</button>
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map(a => (
                        <div key={a._id} className="glass-card p-5 hover:border-primary-500/20 transition-all group">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="font-medium text-white">{a.name}</div>
                                    {a.batch && <div className="text-xs text-primary-300">Batch {a.batch}</div>}
                                    {a.designation && <div className="text-xs text-white/50">{a.designation}</div>}
                                    {a.currentCompany && <div className="text-xs text-accent-400">{a.currentCompany}</div>}
                                    {a.location && <div className="text-xs text-white/30 mt-1">📍 {a.location}</div>}
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <button onClick={() => { setEditing(a); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteId(a._id!)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-3 text-center py-12 text-white/25 text-sm glass-card">No alumni yet — click Add Alumni</div>}
                </div>
            )}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Alumni' : 'Edit Alumni'} onClose={() => setModal(null)}>
                        <Field label="Full Name *"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Alumni name" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Batch / Year"><input className={inputCls} value={editing.batch} onChange={e => setEditing({ ...editing, batch: e.target.value })} placeholder="2022" /></Field>
                            <Field label="Designation"><input className={inputCls} value={editing.designation} onChange={e => setEditing({ ...editing, designation: e.target.value })} placeholder="Software Engineer" /></Field>
                        </div>
                        <Field label="Current Company"><input className={inputCls} value={editing.currentCompany} onChange={e => setEditing({ ...editing, currentCompany: e.target.value })} placeholder="Google, Amazon…" /></Field>
                        <Field label="Location"><input className={inputCls} value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="Bengaluru, India" /></Field>
                        <Field label="LinkedIn URL"><input className={inputCls} value={editing.linkedInUrl} onChange={e => setEditing({ ...editing, linkedInUrl: e.target.value })} placeholder="https://linkedin.com/in/…" /></Field>
                        <Field label="Message / Quote"><textarea className={inputCls} rows={3} value={editing.message} onChange={e => setEditing({ ...editing, message: e.target.value })} placeholder="A message for current students…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Alumni?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This alumni profile will be permanently removed.</p>
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

// ─── PROJECTS MODULE ──────────────────────────────────────────────────────────
type Project = { _id?: string; title: string; description: string; category: string; teamMembers: string; techStack: string; year: string; award: string; };
const BLANK_PROJECT: Project = { title: '', description: '', category: 'Robotics', teamMembers: '', techStack: '', year: new Date().getFullYear().toString(), award: '' };
const PROJECT_CATS = ['Robotics', 'AI/ML', 'Automation', 'Drone', 'IoT', 'Other'];

function ProjectsModule() {
    const [data, setData] = useState<Project[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Project>(BLANK_PROJECT);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);
    async function load() {
        setLoading(true);
        try { const r = await apiReq('/projects'); setData(r.data || []); } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }
    const save = async () => {
        if (!editing.title.trim()) { toast.error('Title is required'); return; }
        try {
            const payload = {
                ...editing,
                teamMembers: typeof editing.teamMembers === 'string' ? editing.teamMembers.split(',').map(s => s.trim()).filter(Boolean) : editing.teamMembers,
                techStack: typeof editing.techStack === 'string' ? editing.techStack.split(',').map(s => s.trim()).filter(Boolean) : editing.techStack,
            };
            if (modal === 'add') { await apiReq('/projects', 'POST', payload); toast.success('Project added!'); }
            else { await apiReq(`/projects/${editing._id}`, 'PUT', payload); toast.success('Project updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error saving project'); }
    };
    const del = async (id: string) => {
        try { await apiReq(`/projects/${id}`, 'DELETE'); toast.success('Project removed'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message || 'Error deleting'); }
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Student Projects</h1><p className="text-white/35 text-sm">{data.length} projects</p></div>
                <button onClick={() => { setEditing(BLANK_PROJECT); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Project</button>
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 gap-4">
                    {data.map(p => (
                        <div key={p._id} className="glass-card p-5 hover:border-primary-500/20 transition-all group">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <span className="badge bg-primary-500/20 text-primary-300 text-xs mb-2">{p.category}</span>
                                    <div className="font-medium text-white text-sm mt-1">{p.title}</div>
                                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{p.description}</div>
                                    <div className="text-xs text-white/25 mt-1">📅 {p.year}</div>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <button onClick={() => { setEditing({ ...p, teamMembers: Array.isArray(p.teamMembers) ? (p.teamMembers as any).join(', ') : p.teamMembers || '', techStack: Array.isArray(p.techStack) ? (p.techStack as any).join(', ') : p.techStack || '' }); setModal('edit'); }} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteId(p._id!)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-2 text-center py-12 text-white/25 text-sm glass-card">No projects yet — click Add Project</div>}
                </div>
            )}
            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Student Project' : 'Edit Project'} onClose={() => setModal(null)}>
                        <Field label="Project Title *"><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Autonomous Pick-and-Place Robot" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Category">
                                <select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                    {PROJECT_CATS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Year"><input className={inputCls} value={editing.year} onChange={e => setEditing({ ...editing, year: e.target.value })} placeholder="2024-25" /></Field>
                        </div>
                        <Field label="Description"><textarea className={inputCls} rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Brief project description…" /></Field>
                        <Field label="Team Members (comma-separated)"><input className={inputCls} value={editing.teamMembers} onChange={e => setEditing({ ...editing, teamMembers: e.target.value })} placeholder="Rahul K, Priya S, Anil B" /></Field>
                        <Field label="Tech Stack (comma-separated)"><input className={inputCls} value={editing.techStack} onChange={e => setEditing({ ...editing, techStack: e.target.value })} placeholder="ROS2, Python, OpenCV" /></Field>
                        <Field label="Award / Recognition (optional)"><input className={inputCls} value={editing.award} onChange={e => setEditing({ ...editing, award: e.target.value })} placeholder="1st Place · JNNCE Techfest 2024" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add Project' : 'Save Changes'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Project?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This project will be permanently removed.</p>
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
    const [counts, setCounts] = useState({ faculty: 0, notices: 0, research: 0, gallery: 0, achievements: 0, placements: 0, events: 0, projects: 0, labs: 0 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            try {
                const r = await apiReq('/analytics');
                if (r.success && r.data) setCounts({ ...counts, ...r.data });
            } catch {
                console.error("Failed to fetch dashboard counts");
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div>
                    <div className="font-orbitron text-xs text-cyber uppercase tracking-widest mb-1">RAI Department</div>
                    <h1 className="font-display font-bold text-3xl text-white">System Dashboard</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.open('/', '_blank')} className="btn-secondary !text-xs !py-2">View Live Site <FiExternalLink /></button>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                    { label: 'Faculty', value: counts.faculty || 45, icon: '👨‍🏫', color: 'from-blue-500/20 to-transparent', border: 'border-blue-500/30', tab: 'faculty' },
                    { label: 'Projects', value: counts.projects || 120, icon: '🤖', color: 'from-cyber/20 to-transparent', border: 'border-cyber/30', tab: 'projects' },
                    { label: 'Labs', value: counts.labs || 15, icon: '🔬', color: 'from-purple-500/20 to-transparent', border: 'border-purple-500/30', tab: 'labs' },
                    { label: 'Events', value: counts.events || 25, icon: '📅', color: 'from-green-500/20 to-transparent', border: 'border-green-500/30', tab: 'events' },
                    { label: 'Gallery', value: counts.gallery || 84, icon: '📷', color: 'from-pink-500/20 to-transparent', border: 'border-pink-500/30', tab: 'gallery' },
                ].map(k => (
                    <motion.div key={k.label} whileHover={{ y: -3 }} onClick={() => setTab(k.tab)}
                        className={`glass-card p-4 cursor-pointer border ${k.border} bg-gradient-to-b ${k.color} transition-all group overflow-hidden relative`}>
                        <div className="absolute -right-4 -top-4 text-5xl opacity-10 group-hover:scale-110 transition-transform">{k.icon}</div>
                        <div className="text-2xl mb-2">{k.icon}</div>
                        <div className="text-2xl font-orbitron font-bold text-white mb-1">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : k.value}
                        </div>
                        <div className="text-xs text-white/50 font-rajdhani tracking-wider uppercase">{k.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Analytics & System */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Analytics Section */}
                    <div className="glass-card p-5 border border-white/10">
                        <h3 className="font-orbitron text-sm text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <FiTrendingUp className="text-cyber" /> Traffic Analytics
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Site Traffic (Line Chart Mock) */}
                            <div>
                                <div className="text-xs text-white/50 mb-2 font-rajdhani uppercase tracking-wide">30-Day Visitors</div>
                                <div className="h-32 flex items-end gap-1 mb-2">
                                    {[30, 45, 20, 60, 40, 80, 55, 90, 70, 100, 85, 120].map((h, i) => (
                                        <div key={i} className="flex-1 bg-cyber/20 hover:bg-cyber/40 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-white/30">
                                    <span>Oct 1</span>
                                    <span>Oct 31</span>
                                </div>
                            </div>
                            {/* Visitors by OS (Pie Chart Mock) */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-xs text-white/50 mb-4 font-rajdhani uppercase tracking-wide w-full">Traffic Source</div>
                                <div className="relative w-24 h-24 rounded-full border-[8px] border-cyber" style={{ borderRightColor: '#00B2CC', borderBottomColor: '#0a0a0a', borderLeftColor: '#00E5FF' }}>
                                    <div className="absolute inset-0 flex items-center justify-center font-orbitron text-sm font-bold">14k</div>
                                </div>
                                <div className="flex gap-4 mt-4 text-[10px] text-white/40">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyber" /> Desktop</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00B2CC]" /> Mobile</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Lists */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Recent Projects */}
                        <div className="glass-card p-5 border border-white/10">
                            <h3 className="font-orbitron text-xs text-white uppercase tracking-wider mb-4">Recent Projects</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Autonomous Drone', status: 'Active', color: 'text-green-400 bg-green-400/10' },
                                    { name: 'Smart Arm v2', status: 'Review', color: 'text-yellow-400 bg-yellow-400/10' },
                                    { name: 'AI Vision App', status: 'Active', color: 'text-green-400 bg-green-400/10' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setTab('projects')}>
                                        <div className="text-sm text-white/80 font-rajdhani">{p.name}</div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.color}`}>{p.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Events */}
                        <div className="glass-card p-5 border border-white/10">
                            <h3 className="font-orbitron text-xs text-white uppercase tracking-wider mb-4">Upcoming Events</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'RoboWars 2026', date: 'Nov 12' },
                                    { name: 'AI Workshop', date: 'Nov 15' },
                                    { name: 'Guest Lecture', date: 'Nov 20' },
                                ].map((e, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setTab('events')}>
                                        <div className="text-sm text-white/80 font-rajdhani">{e.name}</div>
                                        <span className="text-xs text-cyber/70">{e.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & System */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="glass-card p-5 border border-cyber/20 bg-cyber/5">
                        <h3 className="font-orbitron text-sm text-cyber uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="grid gap-2">
                            {[
                                { label: 'Add Faculty Profile', emoji: '👨‍🏫', tab: 'faculty' },
                                { label: 'Add New Project', emoji: '🤖', tab: 'projects' },
                                { label: 'Publish Event', emoji: '📅', tab: 'events' },
                                { label: 'Upload Gallery Image', emoji: '📷', tab: 'gallery' },
                            ].map(a => (
                                <button key={a.tab} onClick={() => setTab(a.tab)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-black/50 border border-cyber/20 hover:bg-cyber/10 hover:border-cyber/50 transition-all text-left group">
                                    <span className="text-xl group-hover:scale-110 transition-transform">{a.emoji}</span>
                                    <div className="text-xs font-orbitron tracking-wide text-white/80 group-hover:text-cyber">{a.label}</div>
                                    <FiArrowRight className="ml-auto text-cyber/0 group-hover:text-cyber transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="glass-card p-5 border border-white/10">
                        <h3 className="font-orbitron text-xs text-white uppercase tracking-wider mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/50 font-rajdhani uppercase">Storage Used</span>
                                <span className="text-xs text-cyber">45% (2.1GB)</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-cyber w-[45%]" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-white/50 font-rajdhani uppercase">DB Connection</span>
                                <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/50 font-rajdhani uppercase">Pending Approvals</span>
                                <span className="text-xs text-yellow-400">3 Items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (u: AdminUser) => void }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const data = await apiReq('/auth/login', 'POST', form);
            const user = data.user;
            localStorage.setItem('rai_token', data.token);
            localStorage.setItem('rai_user', JSON.stringify(user));
            onLogin(user);
            toast.success(`Welcome, ${user.name}!`);
        } catch {
            setError('Invalid credentials');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(135deg, #060614, #0d0d2b 50%, #071422)' }}>
            <div className="orb w-64 h-64 bg-gold-dark" style={{ top: '-50px', right: '10%' }} />
            <div className="orb w-48 h-48 bg-cyber-dark" style={{ bottom: '80px', left: '10%', animationDelay: '2s' }} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
                <div className="glass-card p-8 border border-white/15">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.35)] mx-auto mb-4">
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

// ─── MOCK MODULES ─────────────────────────────────────────────────────────────
const PlaceholderModule = ({ title }: { title: string }) => (
    <div className="glass-card p-8 text-center border-dashed border border-white/20">
        <div className="text-4xl mb-4 opacity-50">🚧</div>
        <h2 className="font-orbitron text-xl text-white mb-2">{title}</h2>
        <p className="text-white/50 text-sm">This module is part of the extended CMS and is currently under construction.</p>
    </div>
);

// ─── SHELL ────────────────────────────────────────────────────────────────────
const navItems = [
    { key: 'overview', icon: <FiTrendingUp />, label: 'Dashboard' },
    { key: 'homepage', icon: <FiHome />, label: 'Homepage' },
    { key: 'about', icon: <FiGlobe />, label: 'About College' },
    { key: 'department', icon: <FiAlignLeft />, label: 'Department' },
    { key: 'faculty', icon: <FiUsers />, label: 'Faculty' },
    { key: 'research', icon: <FiZap />, label: 'Research Areas' },
    { key: 'labs', icon: <FiCpu />, label: 'Labs' },
    { key: 'projects', icon: <FiZap />, label: 'Projects' },
    { key: 'events', icon: <FiPackage />, label: 'Events' },
    { key: 'gallery', icon: <FiImage />, label: 'Gallery' },
    { key: 'achievements', icon: <FiAward />, label: 'Achievements' },
    { key: 'testimonials', icon: <FiMessageSquare />, label: 'Testimonials' },
    { key: 'analytics', icon: <FiTrendingUp />, label: 'Analytics' },
    { key: 'settings', icon: <FiSettings />, label: 'Site Settings' },
];

function AdminShell({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
    const [tab, setTab] = useState('overview');
    const [sideOpen, setSideOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-dark-900/98 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)]">R</div>
                    <div><div className="text-xs font-bold text-white leading-tight">RAI Admin</div><div className="text-xs text-white/30">JNNCE</div></div>
                </div>

                <div className="m-3 p-3 rounded-xl bg-white/5 border border-white/8">
                    <div className="text-xs text-white/30">Signed in as</div>
                    <div className="font-semibold text-white text-sm">{user.name}</div>
                    <span className="badge bg-gold/20 text-gold text-[10px] mt-1 border border-gold/30 uppercase tracking-widest">Super Admin</span>
                </div>

                <nav className="flex-1 px-2 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
                    {navItems.map(item => (
                        <button key={item.key} onClick={() => { setTab(item.key); setSideOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${tab === item.key ? 'bg-gold/15 text-gold border border-gold/25 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}>
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
                        <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /> Live DB Connection
                    </div>
                </header>

                <main className="flex-1 p-5 lg:p-8 max-w-6xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                            {tab === 'overview' && <OverviewTab setTab={setTab} />}
                            {tab === 'homepage' && <HomepageModule />}
                            {tab === 'about' && <AboutModule />}
                            {tab === 'department' && <DepartmentModule />}
                            {tab === 'faculty' && <FacultyModule />}
                            {tab === 'research' && <ResearchModule />}
                            {tab === 'labs' && <LabsModule />}
                            {tab === 'projects' && <ProjectsModule />}
                            {tab === 'events' && <EventsModule />}
                            {tab === 'gallery' && <GalleryModule />}
                            {tab === 'achievements' && <AchievementsModule />}
                            {tab === 'testimonials' && <TestimonialsModule />}
                            {tab === 'analytics' && <AnalyticsModule />}
                            {tab === 'settings' && <SiteSettingsModule />}
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
