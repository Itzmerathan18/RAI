import Link from 'next/link';
import { FiExternalLink, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-cyber/15 mt-20">
            {/* Cyber line at top */}
            <div className="cyber-line" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-cyber flex items-center justify-center font-orbitron font-black text-black text-sm shadow-glow">R</div>
                            <div>
                                <div className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">Dept. of RAI</div>
                                <div className="text-[10px] text-white/25 tracking-widest uppercase">JNNCE</div>
                            </div>
                        </div>
                        <p className="text-xs text-white/35 leading-relaxed mb-4 font-space">
                            Department of Robotics &amp; Artificial Intelligence,<br />
                            Jawaharlal Nehru National College of Engineering,<br />
                            Navule, Savalanga Road,<br />
                            Shivamogga – 577201, Karnataka.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2">
                            <a href="tel:08182225341" className="flex items-center gap-2 text-xs text-white/35 hover:text-cyber transition-colors font-space">
                                <FiPhone className="w-3 h-3 text-cyber flex-shrink-0" /> 08182 – 225341
                            </a>
                            <a href="mailto:rai@jnnce.ac.in" className="flex items-center gap-2 text-xs text-white/35 hover:text-cyber transition-colors font-space">
                                <FiMail className="w-3 h-3 text-cyber flex-shrink-0" /> rai@jnnce.ac.in
                            </a>
                            <div className="flex items-start gap-2 text-xs text-white/25 font-space">
                                <FiMapPin className="w-3 h-3 text-cyber flex-shrink-0 mt-0.5" /> Navule, Shivamogga – 577201
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-orbitron text-[10px] text-cyber uppercase tracking-widest mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'About Dept.', href: '/about' },
                                { label: 'Faculty', href: '/faculty' },
                                { label: 'Laboratories', href: '/labs' },
                                { label: 'Research', href: '/research' },
                                { label: 'Projects', href: '/projects' },
                                { label: 'Gallery', href: '/gallery' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-xs text-white/35 hover:text-cyber transition-colors font-space">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Student Links */}
                    <div>
                        <h4 className="font-orbitron text-[10px] text-cyber uppercase tracking-widest mb-4">Students</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Placements', href: '/placements' },
                                { label: 'Achievements', href: '/achievements' },
                                { label: 'Alumni', href: '/alumni' },
                                { label: 'Notices', href: '/notices' },
                                { label: 'Analytics', href: '/analytics' },
                                { label: 'Contact Dept.', href: '/contact' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-xs text-white/35 hover:text-cyber transition-colors font-space">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Affiliations */}
                    <div>
                        <h4 className="font-orbitron text-[10px] text-cyber uppercase tracking-widest mb-4">Affiliations</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'JNNCE Official Website', href: 'https://jnnce.ac.in' },
                                { label: 'VTU, Belagavi', href: 'https://vtu.ac.in' },
                                { label: 'AICTE India', href: 'https://aicte-india.org' },
                                { label: 'NAAC', href: 'https://naac.gov.in' },
                                { label: 'NES (Trust)', href: '#' },
                            ].map(l => (
                                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-white/30 hover:text-cyber transition-colors font-space">
                                    <FiExternalLink className="w-3 h-3 flex-shrink-0" /> {l.label}
                                </a>
                            ))}
                        </div>

                        {/* Accreditation badges */}
                        <div className="mt-6 flex flex-col gap-2">
                            {['VTU Affiliated', 'AICTE Approved', 'NAAC A Grade'].map(b => (
                                <span key={b} className="badge-cyber badge text-[10px] w-fit">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[10px] text-white/20 font-space">
                        © {new Date().getFullYear()} Dept. of Robotics &amp; Artificial Intelligence · JNNCE, Shivamogga. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[10px] text-white/20 hover:text-cyber transition-colors font-orbitron uppercase tracking-widest">Admin</Link>
                        <span className="text-[10px] text-white/15 font-space">VTU Reg. No: PES20AI · Est. 2020</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
