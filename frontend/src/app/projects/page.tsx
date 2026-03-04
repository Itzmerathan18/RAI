'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const FILTERS = ['All', 'Robotics', 'AI/ML', 'Automation', 'Drone', 'IoT'];

const projects = [
    {
        id: 1, filter: 'Robotics',
        title: 'Autonomous Pick-and-Place Robot',
        team: ['Rahul K', 'Priya S', 'Anil B'],
        year: '2023–24',
        tech: ['ROS2', 'Python', 'OpenCV', 'MoveIt'],
        emoji: '🦾',
        desc: 'A 6-DOF robotic arm powered by ROS2 and computer vision for automated sorting and placement in warehouse environments.',
        award: '🥇 Best Project · VTU Tech Fest 2024',
    },
    {
        id: 2, filter: 'AI/ML',
        title: 'AI-Based Crop Disease Detection',
        team: ['Meera N', 'Suresh P'],
        year: '2023–24',
        tech: ['PyTorch', 'YOLO', 'FastAPI', 'React'],
        emoji: '🌱',
        desc: 'Deep learning model (YOLOv8) trained on 12,000+ images to detect leaf diseases in real-time via smartphone camera.',
        award: '🏆 DST-SERB Funded · ₹12L Grant',
    },
    {
        id: 3, filter: 'Automation',
        title: 'Smart Factory PLC Control System',
        team: ['Kiran M', 'Divya R'],
        year: '2022–23',
        tech: ['Siemens PLC', 'SCADA', 'HMI', 'OPC-UA'],
        emoji: '🏭',
        desc: 'Industry 4.0 prototype integrating Siemens S7-1200 PLC with SCADA monitoring for a simulated assembly line.',
    },
    {
        id: 4, filter: 'Drone',
        title: 'Autonomous Inspection Drone',
        team: ['Sanjay T', 'Kavya L', 'Ravi K'],
        year: '2023–24',
        tech: ['ArduPilot', 'MAVLink', 'Raspberry Pi', 'OpenCV'],
        emoji: '🚁',
        desc: 'GPS-guided inspection drone with onboard vision for identifying structural cracks in bridges and buildings.',
        award: '🥈 Runner-up · Drone Innovation Challenge',
    },
    {
        id: 5, filter: 'IoT',
        title: 'Smart Agriculture Monitoring System',
        team: ['Anjali P', 'Mohan S'],
        year: '2022–23',
        tech: ['ESP32', 'MQTT', 'Node-RED', 'ThingsBoard'],
        emoji: '🌾',
        desc: 'IoT-based farm monitoring with soil moisture, temperature, humidity sensors and automated irrigation via mobile app.',
    },
    {
        id: 6, filter: 'Robotics',
        title: 'Line Follower & Maze Solver Robot',
        team: ['Pooja R', 'Ajay B'],
        year: '2021–22',
        tech: ['Arduino', 'C++', 'PID Control', 'IR Sensors'],
        emoji: '🚗',
        desc: 'Advanced line follower with PID tuning achieving sub-15ms response time. Won 1st place at JNNCE Techfest 2022.',
        award: '🥇 1st Place · JNNCE Techfest 2022',
    },
    {
        id: 7, filter: 'AI/ML',
        title: 'Sign Language to Text Converter',
        team: ['Nisha M', 'Rohan K'],
        year: '2023–24',
        tech: ['MediaPipe', 'TensorFlow', 'Python', 'Tkinter'],
        emoji: '🤟',
        desc: 'Real-time hand gesture recognition to convert Indian Sign Language into text and speech using MediaPipe and LSTM.',
    },
    {
        id: 8, filter: 'Automation',
        title: 'AI-Driven Adaptive Robotic Arm',
        team: ['Chandra S', 'Lakshmi V'],
        year: '2023–24',
        tech: ['ROS', 'Reinforcement Learning', 'Python', 'Gazebo'],
        emoji: '🤖',
        desc: 'Robotic arm trained with reinforcement learning to adaptively grasp objects of varying shapes and densities.',
        award: '🏆 VGST Karnataka Funded · ₹4L',
    },
];

export default function ProjectsPage() {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? projects : projects.filter(p => p.filter === filter);

    return (
        <div className="min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/20 bg-cyber/5 text-cyber text-xs font-orbitron tracking-widest uppercase mb-4">
                    Student Innovation
                </div>
                <h1 className="section-title text-3xl text-white mb-3">
                    Student <span className="gradient-text-static">Projects</span>
                </h1>
                <p className="text-white/35 text-sm font-space">Real-world robotics and AI projects built by RAI students at JNNCE</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-orbitron uppercase tracking-wider transition-all ${filter === f
                                ? 'bg-cyber text-black border border-cyber shadow-glow'
                                : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
                            }`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Project Grid */}
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                    {filtered.map((p, i) => (
                        <motion.div key={p.id} layout
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, delay: i * 0.06 }}
                            whileHover={{ y: -5, borderColor: 'rgba(0,229,255,0.35)' }}
                            className="glass-card p-6 border border-white/5 hover:shadow-glow transition-all duration-300 group flex flex-col">

                            {/* Top */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-cyber/10 border border-cyber/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-cyber/40 transition-colors">
                                    {p.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="badge-cyber badge text-[10px]">{p.filter}</span>
                                        <span className="text-[10px] text-white/25 font-space">{p.year}</span>
                                    </div>
                                    <h3 className="font-orbitron font-bold text-white text-sm leading-tight">{p.title}</h3>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-white/45 leading-relaxed font-space mb-4 flex-1">{p.desc}</p>

                            {/* Award if any */}
                            {p.award && (
                                <div className="mb-4 px-3 py-2 rounded-lg bg-cyber/6 border border-cyber/15 text-xs text-cyber font-space">
                                    {p.award}
                                </div>
                            )}

                            {/* Team */}
                            <div className="mb-3">
                                <div className="text-[10px] text-white/25 uppercase tracking-widest font-orbitron mb-1.5">Team</div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {p.team.map(m => (
                                        <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50 font-space">{m}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Tech stack */}
                            <div>
                                <div className="text-[10px] text-white/25 uppercase tracking-widest font-orbitron mb-1.5">Tech Stack</div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {p.tech.map(t => (
                                        <span key={t} className="px-2 py-0.5 rounded-full border border-cyber/20 bg-cyber/5 text-[10px] text-cyber font-space">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-white/20 font-space text-sm">No projects in this category.</div>
            )}

            {/* Submit CTA */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="mt-14 glass-card-cyan p-8 text-center max-w-xl mx-auto">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-orbitron font-bold text-white text-base mb-2">Submit Your Project</h3>
                <p className="text-sm text-white/40 mb-5 font-space">RAI students can submit their projects for showcase. Contact the department with your project report.</p>
                <a href="mailto:rai@jnnce.ac.in" className="btn-primary text-sm">Submit via Email</a>
            </motion.div>
        </div>
    );
}
