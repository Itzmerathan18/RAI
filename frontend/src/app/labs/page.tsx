'use client';
import { motion } from 'framer-motion';

// Real labs from JNNCE RAI department
const labs = [
    {
        id: 1, emoji: '🤖', name: 'Robotics Lab – Lab 1',
        desc: 'Core robotics laboratory equipped for CAD design, RoboDK-based robotics simulation, and hands-on programming in C/Python for robotics applications.',
        inCharge: 'Dr. Basappaji K M',
        equipment: [
            'RoboDK Robot Simulation Suite',
            'Arduino Mega & Nano Kits',
            'Servo Motor & Stepper Motor Kits',
            'Raspberry Pi 4 Boards',
            'Sensor Arrays (Ultrasonic, IR, IMU)',
            'Line Following & Maze Robots',
        ],
        software: ['RoboDK', 'Arduino IDE', 'Python 3.x', 'C/C++', 'Proteus'],
        color: 'from-blue-600 to-primary-600',
        tag: 'Simulation & Prototyping',
    },
    {
        id: 2, emoji: '🧪', name: 'Robotics Lab – Lab 2',
        desc: 'Advanced robotics lab focused on AI experiments, advanced simulation, and integrated robotics + AI laboratory experiments under VTU curriculum.',
        inCharge: 'Prof. Suresh M',
        equipment: [
            'ROS 2 Workstations',
            'LiDAR Sensor Modules (RPLIDAR)',
            'Mobile Robot Platforms',
            'ESP32 / STM32 Dev Boards',
            'IP Cameras for Vision Projects',
            'Motor Driver Boards & PCB Tools',
        ],
        software: ['ROS2 (Humble)', 'Gazebo Simulator', 'OpenCV', 'Python', 'MATLAB'],
        color: 'from-purple-600 to-blue-600',
        tag: 'Advanced Robotics',
    },
    {
        id: 3, emoji: '🔩', name: 'Hardware Interaction Lab',
        desc: 'Dedicated hardware lab bridging the gap between simulation and real-world deployment — students interact with physical robots, actuators, and sensor systems.',
        inCharge: 'Prof. Vinay H',
        equipment: [
            '6-DOF Robotic Arm (Educational)',
            'CNC Router & Laser Cutter',
            'Oscilloscope & Logic Analyzer',
            '3D Printer (FDM)',
            'Hydraulic & Pneumatic Trainers',
            'PLC Trainer (Siemens/Allen-Bradley)',
        ],
        software: ['SolidWorks', 'AutoCAD', 'STEP 7', 'Siemens TIA Portal'],
        color: 'from-orange-600 to-red-600',
        tag: 'Hardware & Mechatronics',
    },
    {
        id: 4, emoji: '🧠', name: 'AI, ML & Robotics Research Lab',
        desc: 'GPU-server–powered research lab enabling high-performance computation for deep learning, computer vision, and AI research. Aligned with JNNCE\'s research mandate.',
        inCharge: 'Dr. Chetan K R',
        equipment: [
            'High-Performance GPU Server',
            'NVIDIA Jetson Nano (Edge AI)',
            'ML Workstations (RTX 3060+)',
            'FPGA Development Boards (Xilinx)',
            'Raspberry Pi 4 Cluster',
            'Industrial IP Cameras',
        ],
        software: ['TensorFlow 2.x', 'PyTorch', 'Scikit-learn', 'OpenCV', 'Jupyter', 'CUDA Toolkit'],
        color: 'from-violet-600 to-pink-600',
        tag: 'AI / Deep Learning Research',
    },
    {
        id: 5, emoji: '💡', name: 'AICTE-IDEA Lab',
        desc: 'Shared innovation lab aligned with the National Education Policy (NEP) 2020. An AICTE-funded facility that fosters hands-on learning, creativity, design thinking, and startup ideation.',
        inCharge: 'Dr. Basappaji K M',
        equipment: [
            'Design Thinking Workstations',
            'Arduino & Raspberry Pi Maker Kits',
            '3D Printers & Resin Printers',
            'Laser Cutter',
            'Electronics Prototyping Tools',
            'IoT Development Kits',
        ],
        software: ['TinkerCAD', 'Fusion 360', 'MIT App Inventor', 'Python', 'Arduino IDE'],
        color: 'from-green-600 to-emerald-600',
        tag: 'AICTE-IDEA · NEP 2020',
    },
];

export default function LabsPage() {
    return (
        <div className="min-h-screen pt-20">
            <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-5">World-Class Infrastructure</div>
                    <h1 className="section-title text-5xl gradient-text mb-4">Research Laboratories</h1>
                    <p className="text-white/50 max-w-2xl mx-auto">Five specialized laboratories — from RoboDK simulation to GPU-powered AI research and the AICTE-IDEA Lab — enabling hands-on excellence</p>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: '🧪', label: 'Specialized Labs', value: '5' },
                        { icon: '💡', label: 'AICTE-IDEA Lab', value: '1' },
                        { icon: '🖥️', label: 'GPU Research Lab', value: '1' },
                        { icon: '👩‍🔬', label: 'Student Capacity', value: '120+' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-5 text-center hover:border-primary-500/30 transition-all">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className="text-3xl font-display font-black gradient-text">{s.value}</div>
                            <div className="text-xs text-white/40 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Lab Cards */}
                <div className="space-y-8">
                    {labs.map((lab, i) => (
                        <motion.div key={lab.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }} viewport={{ once: true }}
                            whileHover={{ scale: 1.005 }}
                            className="glass-card overflow-hidden hover:border-primary-500/30 transition-all duration-300">
                            <div className={`h-1.5 bg-gradient-to-r ${lab.color}`} />
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Left */}
                                    <div className="lg:w-1/3">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lab.color} flex items-center justify-center text-3xl shadow-glow`}>{lab.emoji}</div>
                                            <div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border mb-1.5 inline-block text-white/50 border-white/10`}>{lab.tag}</span>
                                                <h2 className="font-display font-bold text-lg text-white leading-tight">{lab.name}</h2>
                                                <p className="text-xs text-white/35 mt-0.5">In-charge: {lab.inCharge}</p>
                                            </div>
                                        </div>
                                        <p className="text-white/55 text-sm leading-relaxed">{lab.desc}</p>
                                    </div>

                                    {/* Right */}
                                    <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-primary-400 text-xs uppercase tracking-widest mb-3">Equipment & Hardware</h3>
                                            <ul className="space-y-2">
                                                {lab.equipment.map(eq => (
                                                    <li key={eq} className="flex items-start gap-2 text-sm text-white/55">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                                                        {eq}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-accent-400 text-xs uppercase tracking-widest mb-3">Software & Tools</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {lab.software.map(sw => (
                                                    <motion.span key={sw} whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/55 hover:border-accent-500/30 hover:text-accent-300 transition-all cursor-default">
                                                        {sw}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* JNNCE note */}
                <p className="text-center text-xs text-white/20 mt-8">
                    Source: JNNCE Dept. of RAI lab facilities. Visit{' '}
                    <a href="https://jnnce.ac.in" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">jnnce.ac.in</a>{' '}
                    for official details.
                </p>
            </section>
        </div>
    );
}
