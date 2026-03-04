'use client';
import { motion } from 'framer-motion';

const peos = [
    { id: 'PEO1', title: 'Core Technical Expertise', desc: 'Graduates will apply knowledge of mathematics, sciences, and engineering fundamentals to design and develop robotic systems and AI-driven solutions.' },
    { id: 'PEO2', title: 'Innovation & Research', desc: 'Graduates will contribute to research, design innovative products, and solve complex problems in robotics, automation, and artificial intelligence.' },
    { id: 'PEO3', title: 'Industry Readiness', desc: 'Graduates will be employable in industry and capable of contributing to the automation, manufacturing, defence, healthcare and technology sectors.' },
    { id: 'PEO4', title: 'Professional Ethics & Leadership', desc: 'Graduates will exhibit ethical professional behaviour, leadership skills, and adapt to evolving technological landscapes.' },
];

const pos = [
    { code: 'PO1', title: 'Engineering Knowledge', desc: 'Apply mathematics, science, and engineering fundamentals to robotics and AI systems.' },
    { code: 'PO2', title: 'Problem Analysis', desc: 'Identify and formulate engineering problems in automation and study literature for solutions.' },
    { code: 'PO3', title: 'Design/Development', desc: 'Design solutions for complex engineering problems including mechanical, electronic, and AI components.' },
    { code: 'PO4', title: 'Investigation', desc: 'Conduct experiments and analyse data for research in robotics and autonomous systems.' },
    { code: 'PO5', title: 'Modern Tool Usage', desc: 'Use modern engineering tools like ROS, MATLAB, Python, TensorFlow, and SolidWorks effectively.' },
    { code: 'PO6', title: 'Society & Environment', desc: 'Understand the societal and environmental implications of robotic and AI deployments.' },
    { code: 'PO7', title: 'Sustainability', desc: 'Design sustainable engineering solutions with minimal environmental impact.' },
    { code: 'PO8', title: 'Ethics', desc: 'Apply ethical principles and professional responsibilities in engineering practice.' },
    { code: 'PO9', title: 'Team Work', desc: 'Function effectively as an individual and as a member or leader of engineering teams.' },
    { code: 'PO10', title: 'Communication', desc: 'Communicate effectively on complex engineering activities with diverse audiences.' },
    { code: 'PO11', title: 'Project Management', desc: 'Demonstrate knowledge of finance, management, and engineering economics in multidisciplinary settings.' },
    { code: 'PO12', title: 'Life-Long Learning', desc: 'Recognise the need and ability to engage in life-long learning in the context of technological change.' },
];

const psos = [
    { code: 'PSO1', title: 'Robotics System Design', desc: 'Ability to design, prototype, and programme robotic systems using tools like ROS, MATLAB, and hardware platforms (Arduino, Raspberry Pi).' },
    { code: 'PSO2', title: 'AI & ML Applications', desc: 'Ability to apply machine learning, deep learning and computer vision algorithms to solve real-world engineering challenges.' },
    { code: 'PSO3', title: 'Industrial Automation', desc: 'Competence in designing PLC-based, IoT-integrated automation systems for industrial and smart manufacturing environments.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20">
            {/* Page Header */}
            <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">About the Department</div>
                    <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
                        Dept. of <span className="gradient-text">Robotics &amp; AI</span>
                    </h1>
                    <p className="text-white/55 max-w-2xl mx-auto text-base leading-relaxed">
                        Established in 2020, the Department of Robotics &amp; Artificial Intelligence at JNNCE, Shivamogga is an interdisciplinary department offering B.E. in Robotics &amp; AI, affiliated to Visvesvaraya Technological University (VTU), Belagavi. With an annual intake of 60 students, the department is committed to producing world-class engineers ready for the age of intelligent machines.
                    </p>
                </motion.div>

                {/* ── Real Department Sign Photo ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mb-12 flex flex-col items-center">
                    <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-cyber/20 shadow-glow-lg">
                        <img
                            src="/images/rai-sign-entrance.jpeg"
                            alt="Department of Robotics & Artificial Intelligence — JNNCE, Shivamogga"
                            className="w-full h-auto object-cover"
                            style={{ display: 'block' }}
                        />
                        {/* Bottom caption bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-5 py-3 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-cyber animate-pulse flex-shrink-0" />
                            <span className="text-xs font-orbitron text-cyber uppercase tracking-widest">
                                Department of Robotics &amp; Artificial Intelligence · JNNCE, Shivamogga
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-white/25 mt-3 font-space text-center">
                        Official department signboard · Jawaharlal Nehru National College of Engineering, Navule, Shivamogga – 577201
                    </p>
                </motion.div>

                {/* Key Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { label: 'Established', value: '2020', icon: '🏛', sub: 'Department Year' },
                        { label: 'Annual Intake', value: '60', icon: '👥', sub: 'Students per batch' },
                        { label: 'Affiliation', value: 'VTU', icon: '🎓', sub: 'Belagavi' },
                        { label: 'Accreditation', value: 'NAAC A', icon: '⭐', sub: 'AICTE Approved' },
                    ].map(fact => (
                        <motion.div key={fact.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-5 text-center hover:border-primary-500/30 hover:shadow-glow transition-all duration-300">
                            <div className="text-3xl mb-2">{fact.icon}</div>
                            <div className="font-display font-black text-2xl gradient-text">{fact.value}</div>
                            <div className="text-sm font-medium text-white/70">{fact.label}</div>
                            <div className="text-xs text-white/30 mt-0.5">{fact.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="glass-card p-8 border-l-4 border-primary-500 hover:shadow-glow transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-xl">🎯</div>
                            <h2 className="font-display font-bold text-xl text-white">Vision</h2>
                        </div>
                        <p className="text-white/65 leading-relaxed">
                            To be a nationally recognized centre of excellence in Robotics and Artificial Intelligence education, producing innovative engineers who lead technological advancements in autonomous systems, intelligent machines, and smart automation for global societal benefit.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="glass-card p-8 border-l-4 border-accent-500 hover:shadow-glow transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-xl">🚀</div>
                            <h2 className="font-display font-bold text-xl text-white">Mission</h2>
                        </div>
                        <ul className="space-y-2 text-white/65">
                            {[
                                'Deliver outcome-based education with industry-relevant curriculum under VTU',
                                'Foster research culture through funded projects with government and industry bodies',
                                'Build state-of-the-art laboratories enabling hands-on practical learning',
                                'Nurture entrepreneurship, ethics, and lifelong learning among students',
                            ].map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                                    <span className="text-accent-400 text-xs mt-0.5 font-bold">M{i + 1}</span> {m}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* HOD Message */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass-card p-8 mb-16"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.04))' }}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-4xl font-bold text-white shadow-glow">B</div>
                            <div className="mt-3 text-center">
                                <div className="font-semibold text-white text-sm">Dr. Basappaji K M</div>
                                <div className="text-xs text-primary-300">Head of Department</div>
                                <div className="text-xs text-white/40">Dept. of RAI, JNNCE</div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-display font-bold text-2xl text-white mb-4">Message from the HOD</h2>
                            <div className="space-y-3 text-white/65 text-sm leading-relaxed">
                                <p>
                                    Welcome to the Department of Robotics & Artificial Intelligence at Jawaharlal Nehru National College of Engineering, Shivamogga. Our department represents a convergence of cutting-edge technologies — robotics, machine learning, control systems, mechatronics, and embedded AI — united under one interdisciplinary programme.
                                </p>
                                <p>
                                    Since our establishment in 2020, we have been committed to delivering outcome-based education that prepares students for the challenges of Industry 4.0. Our laboratories — including RoboDK-based simulation labs, an AI/ML GPU research facility, a dedicated hardware interaction lab, and the AICTE-IDEA Lab — provide an environment where theoretical knowledge transforms into practical innovation.
                                </p>
                                <p>
                                    We believe in the philosophy that great engineers are not just technically proficient, but are also curious, ethical, and driven to create a positive impact. I invite you to explore our academic programmes, research initiatives, and the vibrant student community that makes RAI at JNNCE a place of genuine excellence.
                                </p>
                                <p className="text-white/50 font-medium">— Dr. Basappaji K M, Head of Department, RAI</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* PEOs */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-3">Program Educational Objectives</div>
                        <h2 className="section-title text-3xl text-white">PEOs</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        {peos.map((peo, i) => (
                            <motion.div key={peo.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                                className="glass-card p-6 hover:border-primary-500/30 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="badge bg-primary-500/20 text-primary-300 font-bold">{peo.id}</span>
                                    <h3 className="font-semibold text-white">{peo.title}</h3>
                                </div>
                                <p className="text-sm text-white/55 leading-relaxed">{peo.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* POs */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-3">Program Outcomes</div>
                        <h2 className="section-title text-3xl text-white">12 Program Outcomes (POs)</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pos.map((po, i) => (
                            <motion.div key={po.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: (i % 6) * 0.07 }} viewport={{ once: true }}
                                className="glass-card p-5 hover:border-accent-500/30 transition-all group">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-9 h-9 rounded-xl bg-accent-500/15 flex items-center justify-center text-sm font-bold text-accent-300 flex-shrink-0">{po.code}</span>
                                    <h3 className="font-semibold text-white text-sm">{po.title}</h3>
                                </div>
                                <p className="text-xs text-white/45 leading-relaxed pl-12">{po.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* PSOs */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-3">Program Specific Outcomes</div>
                        <h2 className="section-title text-3xl text-white">PSOs</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {psos.map((pso, i) => (
                            <motion.div key={pso.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                                className="glass-card p-6 border-t-4 border-primary-500 hover:shadow-glow transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center font-bold text-primary-300">{pso.code}</span>
                                    <h3 className="font-semibold text-white">{pso.title}</h3>
                                </div>
                                <p className="text-sm text-white/55 leading-relaxed">{pso.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Accreditations */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass-card p-8 text-center">
                    <h2 className="section-title text-2xl text-white mb-6">Accreditations & Affiliations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'VTU, Belagavi', role: 'Affiliated University', emoji: '🏛' },
                            { name: 'AICTE', role: 'Regulatory Body', emoji: '📋' },
                            { name: 'NAAC', role: 'A Grade Accreditation', emoji: '⭐' },
                            { name: 'NES', role: 'Management Body', emoji: '🏢' },
                        ].map(a => (
                            <div key={a.name} className="p-4 rounded-xl bg-white/5 hover:bg-primary-500/10 transition-all">
                                <div className="text-3xl mb-2">{a.emoji}</div>
                                <div className="font-semibold text-white text-sm">{a.name}</div>
                                <div className="text-xs text-white/40">{a.role}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
