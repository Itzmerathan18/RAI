'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiImage } from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors text-sm";
const CATS = ['Events', 'Competitions', 'Cultural', 'Projects', 'Industrial Visits', 'Students', 'Workshops', 'Laboratories', 'College Events'];

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
                className="relative z-10 w-full max-w-xl glass-card p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
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

const BLANK_EVENT = { title: '', category: 'Events', status: 'completed', description: '', thumbnail: '', images: '', videos: '', date: '', eventDuration: '', results: '', published: true };

export function GalleryModule() {
    const [data, setData] = useState<any[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(BLANK_EVENT);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [catFilter, setCatFilter] = useState('All');

    useEffect(() => { load(); }, [catFilter]);

    async function load() {
        setLoading(true);
        try {
            const q = catFilter !== 'All' ? `?category=${catFilter}` : '';
            const r = await apiReq(`/gallery${q}`);
            setData(r.data || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function save() {
        if (!editing.title?.trim()) { toast.error('Title required'); return; }
        try {
            const payload = {
                ...editing,
                images: editing.images ? editing.images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
                videos: editing.videos ? editing.videos.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
            };
            if (modal === 'add') { await apiReq('/gallery', 'POST', payload); toast.success('Event added!'); }
            else { await apiReq(`/gallery/${editing._id}`, 'PUT', payload); toast.success('Event updated!'); }
            setModal(null); load();
        } catch (e: any) { toast.error(e.message || 'Error'); }
    }

    async function del(id: string) {
        try { await apiReq(`/gallery/${id}`, 'DELETE'); toast.success('Deleted'); setDeleteId(null); load(); }
        catch (e: any) { toast.error(e.message); }
    }

    const prepareEdit = (ev: any) => ({
        ...ev,
        images: Array.isArray(ev.images) ? ev.images.join('\n') : ev.images,
        videos: Array.isArray(ev.videos) ? ev.videos.join('\n') : ev.videos,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="font-display font-bold text-3xl text-white">Gallery Events</h1><p className="text-white/35 text-sm">{data.length} events</p></div>
                <button onClick={() => { setEditing({ ...BLANK_EVENT }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Event</button>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['All', ...CATS].map(c => (
                    <button key={c} onClick={() => setCatFilter(c)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${catFilter === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                        {c}
                    </button>
                ))}
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map(ev => (
                        <div key={ev._id} className="glass-card overflow-hidden hover:border-primary-500/20 transition-all group">
                            <div className="aspect-video bg-white/5 relative overflow-hidden">
                                {ev.thumbnail ? (
                                    <img src={ev.thumbnail} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10"><FiImage className="w-8 h-8" /></div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditing(prepareEdit(ev)); setModal('edit'); }} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-primary-500/80 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setDeleteId(ev._id)} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500/80 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
                                </div>
                                <span className={`absolute top-2 left-2 badge text-xs ${ev.status === 'ongoing' ? 'bg-accent-500/80 text-black' : 'bg-black/60 text-white/60'}`}>
                                    {ev.status === 'ongoing' ? '🟢 Live' : '✅ Done'}
                                </span>
                            </div>
                            <div className="p-4">
                                <span className="badge bg-cyber/15 text-cyber text-xs mb-2">{ev.category}</span>
                                <h3 className="font-semibold text-white text-sm leading-tight">{ev.title}</h3>
                                {ev.images?.length > 0 && <p className="text-xs text-white/30 mt-1">{ev.images.length} photos</p>}
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-3 text-center py-12 text-white/25 text-sm glass-card">No gallery events yet</div>}
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Gallery Event' : 'Edit Event'} onClose={() => setModal(null)}>
                        <Field label="Event Title *"><input className={inputCls} value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Robothon 2024" /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Category"><select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                {CATS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                            </select></Field>
                            <Field label="Status"><select className={inputCls} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                                <option value="completed" className="bg-dark-900">Completed</option>
                                <option value="ongoing" className="bg-dark-900">Ongoing</option>
                            </select></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Date"><input type="date" className={inputCls} value={editing.date || ''} onChange={e => setEditing({ ...editing, date: e.target.value })} /></Field>
                            <Field label="Duration"><input className={inputCls} value={editing.eventDuration || ''} onChange={e => setEditing({ ...editing, eventDuration: e.target.value })} placeholder="3 Days" /></Field>
                        </div>
                        <Field label="Thumbnail URL"><input className={inputCls} value={editing.thumbnail || ''} onChange={e => setEditing({ ...editing, thumbnail: e.target.value })} placeholder="https://…" /></Field>
                        <Field label="Description"><textarea className={inputCls} rows={2} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Event description…" /></Field>
                        <Field label="Image URLs (one per line)"><textarea className={inputCls} rows={3} value={editing.images || ''} onChange={e => setEditing({ ...editing, images: e.target.value })} placeholder="https://img1.jpg&#10;https://img2.jpg" /></Field>
                        <Field label="Video URLs (one per line)"><textarea className={inputCls} rows={2} value={editing.videos || ''} onChange={e => setEditing({ ...editing, videos: e.target.value })} placeholder="https://video.mp4" /></Field>
                        <Field label="Results (winners, highlights)"><textarea className={inputCls} rows={2} value={editing.results || ''} onChange={e => setEditing({ ...editing, results: e.target.value })} placeholder="1st place: Team Alpha…" /></Field>
                        <div className="flex gap-3 mt-2">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Event?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This event and all its photos will be permanently deleted.</p>
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
