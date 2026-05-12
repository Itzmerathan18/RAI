'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiEdit2,
    FiGlobe,
    FiHome,
    FiMessageSquare,
    FiPlus,
    FiSave,
    FiSettings,
    FiTrendingUp,
    FiTrash2,
    FiX,
    FiAlignLeft,
} from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';
const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-colors text-sm';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('rai_token') || '' : '';
}

async function apiReq(path: string, method = 'GET', body?: object) {
    const token = getToken();
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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.2 }} className="relative z-10 w-full max-w-4xl glass-card p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-white">{title}</h3>
                    <button onClick={onClose} aria-label="Close dialog" title="Close dialog" className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"><FiX className="w-5 h-5" /></button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="mb-4">
            <label className="text-sm text-white/50 mb-1.5 block">{label}</label>
            {children}
            {hint && <div className="text-[11px] text-white/25 mt-1">{hint}</div>}
        </div>
    );
}

function parseLines(text: string, separator = '|') {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.split(separator).map(part => part.trim()));
}

function joinLines(items: Array<string | number>, separator = '|') {
    return items.join(separator);
}

type FieldType = 'text' | 'number' | 'textarea' | 'checkbox';
type EditorField = {
    key: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    rows?: number;
    hint?: string;
};

type SingletonModuleProps = {
    title: string;
    icon: React.ReactNode;
    endpoint: string;
    description: string;
    fields: EditorField[];
    defaults: Record<string, any>;
    transformLoad?: (data: Record<string, any>) => Record<string, any>;
    transformSave?: (data: Record<string, any>) => Record<string, any>;
    preview?: (data: Record<string, any>) => React.ReactNode;
};

function SingletonModule({ title, icon, endpoint, description, fields, defaults, transformLoad, transformSave, preview }: SingletonModuleProps) {
    const [data, setData] = useState<Record<string, any>>(defaults);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const r = await apiReq(endpoint);
            const raw = (r.data && typeof r.data === 'object') ? r.data : defaults;
            setData(transformLoad ? transformLoad({ ...defaults, ...raw }) : { ...defaults, ...raw });
        } catch {
            toast.error(`Failed to load ${title.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        setSaving(true);
        try {
            const payload = transformSave ? transformSave(data) : data;
            await apiReq(endpoint, 'PUT', payload);
            toast.success(`${title} saved`);
            await load();
        } catch (e: any) {
            toast.error(e.message || `Error saving ${title.toLowerCase()}`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyber mb-2 font-orbitron">{icon} Dynamic Content</div>
                    <h1 className="font-display font-bold text-3xl text-white">{title}</h1>
                    <p className="text-white/35 text-sm mt-1 max-w-2xl">{description}</p>
                </div>
                <button onClick={save} disabled={saving || loading} className="btn-primary text-sm !py-2 !px-4 disabled:opacity-60">
                    <FiSave /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div>
            ) : (
                <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
                    <div className="glass-card p-6 border border-white/10">
                        <div className="grid md:grid-cols-2 gap-4">
                            {fields.map(field => (
                                <Field key={field.key} label={field.label} hint={field.hint}>
                                    {field.type === 'textarea' ? (
                                            <textarea
                                            className={inputCls}
                                            rows={field.rows || 4}
                                            value={data[field.key] ?? ''}
                                            onChange={e => setData({ ...data, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                                aria-label={field.label}
                                                title={field.label}
                                        />
                                    ) : field.type === 'number' ? (
                                        <input
                                            type="number"
                                            className={inputCls}
                                            value={data[field.key] ?? 0}
                                            onChange={e => setData({ ...data, [field.key]: Number(e.target.value) })}
                                            placeholder={field.placeholder}
                                            aria-label={field.label}
                                            title={field.label}
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer" title={field.label}>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(data[field.key])}
                                                onChange={e => setData({ ...data, [field.key]: e.target.checked })}
                                                className="h-4 w-4 rounded border-white/20 bg-transparent text-cyber focus:ring-cyber"
                                                aria-label={field.label}
                                                title={field.label}
                                            />
                                            <span className="text-sm text-white/70">Enable</span>
                                        </label>
                                    ) : (
                                        <input
                                            className={inputCls}
                                            value={data[field.key] ?? ''}
                                            onChange={e => setData({ ...data, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                            aria-label={field.label}
                                            title={field.label}
                                        />
                                    )}
                                </Field>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-5 border border-white/10">
                            <h3 className="font-orbitron text-xs uppercase tracking-wider text-white mb-3">Live Preview</h3>
                            {preview ? preview(data) : <div className="text-sm text-white/40">No preview configured.</div>}
                        </div>
                        <div className="glass-card p-5 border border-cyber/20 bg-cyber/5">
                            <h3 className="font-orbitron text-xs uppercase tracking-wider text-cyber mb-3">Storage</h3>
                            <div className="text-sm text-white/60 leading-relaxed">
                                Changes save directly to the JSON store backing the public site and admin dashboard.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const homepageDefaults = {
    heroEyebrow: 'Est. 1980 · VTU Affiliated · NAAC A Grade',
    heroTitle: 'Robotics & Artificial Intelligence',
    heroSubtitle: 'JNNCE, Shivamogga',
    introTitle: 'About JNNCE',
    introParagraph1: 'JNNCE, established in 1980, is a premier engineering institution committed to academic excellence, innovation, and holistic student development.',
    introParagraph2: 'The department blends robotics, AI, automation, and industry collaborations to support hands-on learning and research.',
    statBadgesText: '60|Intake/Year\nB.E.|4-Year Programme\n5|Research Labs\n90%|Placement Rate',
};

export function HomepageModule() {
    return (
        <SingletonModule
            title="Homepage"
            icon={<FiHome />}
            endpoint="/homepage"
            description="Edit the hero, intro copy, and top-level badges shown on the public homepage."
            fields={[
                { key: 'heroEyebrow', label: 'Hero Eyebrow' },
                { key: 'heroTitle', label: 'Hero Title' },
                { key: 'heroSubtitle', label: 'Hero Subtitle' },
                { key: 'introTitle', label: 'Intro Title' },
                { key: 'introParagraph1', label: 'Intro Paragraph 1', type: 'textarea', rows: 4 },
                { key: 'introParagraph2', label: 'Intro Paragraph 2', type: 'textarea', rows: 4 },
                { key: 'statBadgesText', label: 'Quick Stats', type: 'textarea', rows: 5, hint: 'One badge per line in the format value|label' },
            ]}
            defaults={homepageDefaults}
            transformLoad={data => ({
                ...data,
                statBadgesText: Array.isArray(data.statBadges)
                    ? data.statBadges.map((item: any) => `${item.value}|${item.label}`).join('\n')
                    : homepageDefaults.statBadgesText,
            })}
            transformSave={data => ({
                ...data,
                statBadges: parseLines(data.statBadgesText || '').map(([value, label]) => ({ value, label })).filter((item: any) => item.value && item.label),
            })}
            preview={data => (
                <div className="space-y-3">
                    <div>
                        <div className="text-xs text-cyber uppercase tracking-widest mb-1">{data.heroEyebrow}</div>
                        <div className="font-display text-white font-bold text-lg leading-tight">{data.heroTitle}</div>
                        <div className="text-white/35 text-sm">{data.heroSubtitle}</div>
                    </div>
                    <div className="rounded-xl bg-black/30 border border-white/10 p-3">
                        <div className="text-xs text-white/50 uppercase tracking-wide mb-2">{data.introTitle}</div>
                        <p className="text-sm text-white/60 mb-2">{data.introParagraph1}</p>
                        <p className="text-sm text-white/60">{data.introParagraph2}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {(data.statBadgesText || '').split('\n').filter(Boolean).map((line: string) => {
                            const [value, label] = line.split('|').map((item: string) => item.trim());
                            return (
                                <div key={line} className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                                    <div className="text-cyber font-orbitron text-lg font-bold">{value}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/35 mt-1">{label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        />
    );
}

const aboutDefaults = {
    collegeOverview: 'Jawaharlal Nehru National College of Engineering is a premier institution in Shivamogga focused on engineering education, innovation, and student growth.',
    departmentOverview: 'The Department of Robotics & Artificial Intelligence prepares students for intelligent automation, robotics, and AI-driven industry applications.',
    vision: 'To be a nationally recognized centre of excellence in Robotics and Artificial Intelligence education, producing innovative engineers who lead technological advancements.',
    mission: 'Deliver outcome-based education, foster research culture, build state-of-the-art laboratories, and nurture entrepreneurship and ethics among students.',
};

export function AboutModule() {
    return (
        <SingletonModule
            title="About College"
            icon={<FiGlobe />}
            endpoint="/about"
            description="Manage the college and department overview copy shown on the About page."
            fields={[
                { key: 'collegeOverview', label: 'College Overview', type: 'textarea', rows: 5 },
                { key: 'departmentOverview', label: 'Department Overview', type: 'textarea', rows: 5 },
                { key: 'vision', label: 'Vision', type: 'textarea', rows: 4 },
                { key: 'mission', label: 'Mission', type: 'textarea', rows: 4 },
            ]}
            defaults={aboutDefaults}
            preview={data => (
                <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-xs uppercase tracking-widest text-cyber mb-1">College</div>
                        {data.collegeOverview}
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-xs uppercase tracking-widest text-cyber mb-1">Department</div>
                        {data.departmentOverview}
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-xs uppercase tracking-widest text-cyber mb-1">Vision</div>
                        {data.vision}
                    </div>
                </div>
            )}
        />
    );
}

const departmentDefaults = {
    establishedYear: 2020,
    annualIntake: 60,
    affiliation: 'VTU, Belagavi',
    accreditation: 'NAAC A',
    programme: 'B.E. in Robotics & Artificial Intelligence',
    hodName: 'Dr. Basappaji K M',
    hodTitle: 'Head of Department',
    hodMessage: 'Welcome to the Department of Robotics & Artificial Intelligence at JNNCE, Shivamogga. We combine robotics, machine learning, control systems, and embedded AI to prepare students for Industry 4.0.',
    peosText: 'PEO1|Core Technical Expertise|Apply mathematics, sciences, and engineering fundamentals to design and develop robotic systems and AI-driven solutions.\nPEO2|Innovation & Research|Contribute to research, design innovative products, and solve complex problems in robotics, automation, and artificial intelligence.\nPEO3|Industry Readiness|Become employable in industry and contribute to automation, manufacturing, defence, healthcare, and technology sectors.\nPEO4|Professional Ethics & Leadership|Exhibit ethical professional behaviour, leadership skills, and adaptability to evolving technological landscapes.',
    posText: 'PO1|Engineering Knowledge|Apply mathematics, science, and engineering fundamentals to robotics and AI systems.\nPO2|Problem Analysis|Identify and formulate engineering problems in automation and study literature for solutions.\nPO3|Design/Development|Design solutions for complex engineering problems including mechanical, electronic, and AI components.',
    psosText: 'PSO1|Robotics System Design|Design, prototype, and programme robotic systems using tools like ROS, MATLAB, and hardware platforms.\nPSO2|AI & ML Applications|Apply machine learning, deep learning, and computer vision algorithms to real-world challenges.\nPSO3|Industrial Automation|Design PLC-based, IoT-integrated automation systems for smart manufacturing environments.',
};

export function DepartmentModule() {
    return (
        <SingletonModule
            title="Department"
            icon={<FiAlignLeft />}
            endpoint="/department"
            description="Maintain the core department facts, HOD message, and programme outcomes used across the website."
            fields={[
                { key: 'establishedYear', label: 'Established Year', type: 'number' },
                { key: 'annualIntake', label: 'Annual Intake', type: 'number' },
                { key: 'affiliation', label: 'Affiliation' },
                { key: 'accreditation', label: 'Accreditation' },
                { key: 'programme', label: 'Programme Name' },
                { key: 'hodName', label: 'HOD Name' },
                { key: 'hodTitle', label: 'HOD Title' },
                { key: 'hodMessage', label: 'HOD Message', type: 'textarea', rows: 5 },
                { key: 'peosText', label: 'PEOs', type: 'textarea', rows: 5, hint: 'One item per line: code|title|description' },
                { key: 'posText', label: 'POs', type: 'textarea', rows: 5, hint: 'One item per line: code|title|description' },
                { key: 'psosText', label: 'PSOs', type: 'textarea', rows: 5, hint: 'One item per line: code|title|description' },
            ]}
            defaults={departmentDefaults}
            transformLoad={data => ({
                ...data,
                peosText: Array.isArray(data.peos) ? data.peos.map((item: any) => `${item.code}|${item.title}|${item.desc}`).join('\n') : departmentDefaults.peosText,
                posText: Array.isArray(data.pos) ? data.pos.map((item: any) => `${item.code}|${item.title}|${item.desc}`).join('\n') : departmentDefaults.posText,
                psosText: Array.isArray(data.psos) ? data.psos.map((item: any) => `${item.code}|${item.title}|${item.desc}`).join('\n') : departmentDefaults.psosText,
            })}
            transformSave={data => ({
                ...data,
                peos: parseLines(data.peosText || '').map(([code, title, desc]) => ({ code, title, desc })).filter((item: any) => item.code && item.title),
                pos: parseLines(data.posText || '').map(([code, title, desc]) => ({ code, title, desc })).filter((item: any) => item.code && item.title),
                psos: parseLines(data.psosText || '').map(([code, title, desc]) => ({ code, title, desc })).filter((item: any) => item.code && item.title),
            })}
            preview={data => (
                <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className="text-cyber font-orbitron text-xl font-bold">{data.establishedYear}</div>
                            <div className="text-[10px] uppercase tracking-wider text-white/35 mt-1">Established</div>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className="text-cyber font-orbitron text-xl font-bold">{data.annualIntake}</div>
                            <div className="text-[10px] uppercase tracking-wider text-white/35 mt-1">Intake</div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-xs uppercase tracking-widest text-cyber mb-1">HOD</div>
                        <div className="text-white font-medium">{data.hodName}</div>
                        <div className="text-white/35 text-xs">{data.hodTitle}</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/50">
                        Programme: {data.programme}
                    </div>
                </div>
            )}
        />
    );
}

type Testimonial = {
    _id?: string;
    name: string;
    designation: string;
    quote: string;
    rating: number;
    featured: boolean;
    date: string;
};

const BLANK_TESTIMONIAL: Testimonial = { name: '', designation: '', quote: '', rating: 5, featured: true, date: new Date().toISOString().split('T')[0] };

export function TestimonialsModule() {
    const [data, setData] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Testimonial>(BLANK_TESTIMONIAL);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const r = await apiReq('/testimonials');
            setData(r.data || []);
        } catch {
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    }

    const save = async () => {
        if (!editing.name.trim() || !editing.quote.trim()) {
            toast.error('Name and quote are required');
            return;
        }
        try {
            if (modal === 'add') await apiReq('/testimonials', 'POST', editing);
            else await apiReq(`/testimonials/${editing._id}`, 'PUT', editing);
            toast.success('Testimonial saved');
            setModal(null);
            load();
        } catch (e: any) {
            toast.error(e.message || 'Error saving testimonial');
        }
    };

    const del = async (id: string) => {
        try {
            await apiReq(`/testimonials/${id}`, 'DELETE');
            toast.success('Testimonial deleted');
            setDeleteId(null);
            load();
        } catch (e: any) {
            toast.error(e.message || 'Error deleting testimonial');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyber mb-2 font-orbitron"><FiMessageSquare /> Dynamic Content</div>
                    <h1 className="font-display font-bold text-3xl text-white">Testimonials</h1>
                    <p className="text-white/35 text-sm mt-1">Manage featured student and alumni testimonials used on the website.</p>
                </div>
                            <button onClick={() => { setEditing({ ...BLANK_TESTIMONIAL }); setModal('add'); }} className="btn-primary text-sm !py-2 !px-4"><FiPlus /> Add Testimonial</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid lg:grid-cols-2 gap-4">
                    {data.map(item => (
                        <div key={item._id} className="glass-card p-5 border border-white/10 hover:border-primary-500/20 transition-all">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <div className="font-semibold text-white text-sm">{item.name}</div>
                                    <div className="text-xs text-white/35">{item.designation}</div>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <button onClick={() => { setEditing(item); setModal('edit'); }} aria-label={`Edit testimonial for ${item.name}`} title={`Edit testimonial for ${item.name}`} className="p-1.5 rounded-lg text-white/40 hover:text-primary-300 hover:bg-primary-500/10 transition-all"><FiEdit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteId(item._id!)} aria-label={`Delete testimonial for ${item.name}`} title={`Delete testimonial for ${item.name}`} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">“{item.quote}”</p>
                            <div className="mt-3 flex items-center justify-between text-xs text-white/35">
                                <span>{'★'.repeat(Math.max(1, item.rating || 0))}</span>
                                <span>{item.featured ? 'Featured' : 'Hidden'}</span>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-2 text-center py-12 text-white/25 text-sm glass-card">No testimonials yet — click Add Testimonial</div>}
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <Modal title={modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Field label="Name *"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Student or alumni name" /></Field>
                            <Field label="Designation"><input className={inputCls} value={editing.designation} onChange={e => setEditing({ ...editing, designation: e.target.value })} placeholder="Class of 2024" /></Field>
                            <Field label="Rating"><input type="number" min={1} max={5} className={inputCls} value={editing.rating} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} aria-label="Rating" title="Rating" /></Field>
                            <Field label="Date"><input type="date" className={inputCls} value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} aria-label="Date" title="Date" /></Field>
                        </div>
                        <Field label="Quote *"><textarea className={inputCls} rows={5} value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} placeholder="Short testimonial quote…" /></Field>
                        <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
                            <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-transparent text-cyber focus:ring-cyber" />
                            <span className="text-sm text-white/60">Featured on site</span>
                        </label>
                        <div className="flex gap-3">
                            <button onClick={save} className="btn-primary flex-1 justify-center"><FiSave /> {modal === 'add' ? 'Add' : 'Save'}</button>
                            <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        </div>
                    </Modal>
                )}
                {deleteId && (
                    <Modal title="Delete Testimonial?" onClose={() => setDeleteId(null)}>
                        <p className="text-white/60 mb-5 text-sm">This testimonial will be permanently removed.</p>
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

export function AnalyticsModule() {
    const [data, setData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const r = await apiReq('/analytics');
            setData(r.data || {});
        } catch {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }

    const cards = [
        { label: 'Faculty', key: 'faculty', icon: <FiHome />, color: 'border-blue-500/30 text-blue-300' },
        { label: 'Research', key: 'research', icon: <FiTrendingUp />, color: 'border-cyan-500/30 text-cyan-300' },
        { label: 'Projects', key: 'projects', icon: <FiAlignLeft />, color: 'border-emerald-500/30 text-emerald-300' },
        { label: 'Gallery', key: 'gallery', icon: <FiSettings />, color: 'border-pink-500/30 text-pink-300' },
    ] as const;

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyber mb-2 font-orbitron"><FiTrendingUp /> Live Analytics</div>
                <h1 className="font-display font-bold text-3xl text-white">Analytics</h1>
                <p className="text-white/35 text-sm mt-1">Live counts are pulled from the backend analytics endpoint and reflect current data in the JSON store.</p>
            </div>

            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyber/30 border-t-cyber rounded-full animate-spin" /></div> : (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {cards.map(card => (
                        <div key={card.key} className={`glass-card p-5 border ${card.color} bg-white/5`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-white/40 text-lg">{card.icon}</div>
                                <div className="text-xs text-white/25 uppercase tracking-wider">Live</div>
                            </div>
                            <div className="text-3xl font-orbitron font-bold text-white mb-1">{data[card.key] ?? 0}</div>
                            <div className="text-xs text-white/45 uppercase tracking-wider">{card.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-5 border border-white/10">
                    <h3 className="font-orbitron text-xs uppercase tracking-wider text-white mb-4">Full Dataset Snapshot</h3>
                    <div className="space-y-3 text-sm text-white/60">
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="capitalize">{key}</span>
                                <span className="text-cyber font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card p-5 border border-white/10">
                    <h3 className="font-orbitron text-xs uppercase tracking-wider text-white mb-4">Notes</h3>
                    <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                        <p>These numbers update from the live backend API. When content is added through the admin sections, the analytics view updates after a refresh.</p>
                        <p>Use the content tabs to keep the site data aligned with the counts shown here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SiteSettingsModule() {
    const defaults = {
        siteName: 'Department of Robotics & Artificial Intelligence',
        collegeName: 'Jawaharlal Nehru National College of Engineering',
        contactEmail: 'rai@jnnce.ac.in',
        contactPhone: '+91 00000 00000',
        address: 'JNNCE, Navule, Shivamogga, Karnataka 577201',
        maintenanceMode: false,
        website: 'https://jnnce.ac.in',
        facebook: '',
        instagram: '',
        linkedin: '',
    };

    return (
        <SingletonModule
            title="Site Settings"
            icon={<FiSettings />}
            endpoint="/site-settings"
            description="Update core site contact details and global configuration values."
            fields={[
                { key: 'siteName', label: 'Site Name' },
                { key: 'collegeName', label: 'College Name' },
                { key: 'contactEmail', label: 'Contact Email' },
                { key: 'contactPhone', label: 'Contact Phone' },
                { key: 'address', label: 'Address', type: 'textarea', rows: 4 },
                { key: 'website', label: 'Website URL' },
                { key: 'facebook', label: 'Facebook URL' },
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'linkedin', label: 'LinkedIn URL' },
                { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox' },
            ]}
            defaults={defaults}
            preview={data => (
                <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-xs uppercase tracking-widest text-cyber mb-1">{data.siteName}</div>
                        <div className="text-white/40 text-xs">{data.collegeName}</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs space-y-1">
                        <div>Email: {data.contactEmail}</div>
                        <div>Phone: {data.contactPhone}</div>
                        <div>Website: {data.website}</div>
                    </div>
                    <div className={`rounded-xl border p-3 text-xs ${data.maintenanceMode ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'}`}>
                        {data.maintenanceMode ? 'Maintenance mode is enabled.' : 'Site is live and public.'}
                    </div>
                </div>
            )}
            transformLoad={data => ({
                ...data,
                website: data.socialLinks?.website || defaults.website,
                facebook: data.socialLinks?.facebook || '',
                instagram: data.socialLinks?.instagram || '',
                linkedin: data.socialLinks?.linkedin || '',
            })}
            transformSave={data => ({
                ...data,
                socialLinks: {
                    website: data.website,
                    facebook: data.facebook,
                    instagram: data.instagram,
                    linkedin: data.linkedin,
                },
            })}
        />
    );
}
