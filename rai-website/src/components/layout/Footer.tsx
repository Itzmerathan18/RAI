'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiExternalLink, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi';

export default function Footer() {
    const pathname = usePathname();
    
    if (pathname.startsWith('/admin')) {
        return null;
    }

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
                                <div className="font-orbitron font-bold text-xs text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Dept. of RAI</div>
                                <div className="text-[10px] text-white/45 tracking-widest uppercase font-semibold">JNNCE</div>
                            </div>
                        </div>
                        <p className="text-xs text-white/65 leading-relaxed mb-4 font-space font-medium">
                            Department of Robotics &amp; Artificial Intelligence,<br />
                            Jawaharlal Nehru National College of Engineering,<br />
                            Navule, Savalanga Road,<br />
                            Shivamogga – 577201, Karnataka.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2 mb-6">
                            <a href="tel:08182225341" className="flex items-center gap-2 text-xs text-white/70 hover:text-cyber transition-colors font-space font-medium">
                                <FiPhone className="w-3 h-3 text-cyber flex-shrink-0" /> 08182 – 225341
                            </a>
                            <a href="mailto:rai@jnnce.ac.in" className="flex items-center gap-2 text-xs text-white/70 hover:text-cyber transition-colors font-space font-medium">
                                <FiMail className="w-3 h-3 text-cyber flex-shrink-0" /> rai@jnnce.ac.in
                            </a>
                            <div className="flex items-start gap-2 text-xs text-white/55 font-space font-medium">
                                <FiMapPin className="w-3 h-3 text-cyber flex-shrink-0 mt-0.5" /> Navule, Shivamogga – 577201
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a href="#" aria-label="Facebook" title="Facebook" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-cyber/10 hover:text-cyber hover:shadow-glow transition-all">
                                <FiFacebook className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="Twitter" title="Twitter" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-cyber/10 hover:text-cyber hover:shadow-glow transition-all">
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="LinkedIn" title="LinkedIn" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-cyber/10 hover:text-cyber hover:shadow-glow transition-all">
                                <FiLinkedin className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="YouTube" title="YouTube" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-cyber/10 hover:text-cyber hover:shadow-glow transition-all">
                                <FiYoutube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-orbitron text-[11px] text-cyber uppercase tracking-widest mb-4 font-semibold">Quick Links</h4>
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
                                    <Link href={l.href} className="text-xs text-white/65 hover:text-cyber transition-colors font-space font-medium">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Student Links */}
                    <div>
                        <h4 className="font-orbitron text-[11px] text-cyber uppercase tracking-widest mb-4 font-semibold">Students</h4>
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
                                    <Link href={l.href} className="text-xs text-white/65 hover:text-cyber transition-colors font-space font-medium">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Affiliations */}
                    <div>
                        <h4 className="font-orbitron text-[11px] text-cyber uppercase tracking-widest mb-4 font-semibold">Affiliations</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'JNNCE Official Website', href: 'https://jnnce.ac.in' },
                                { label: 'VTU, Belagavi', href: 'https://vtu.ac.in' },
                                { label: 'AICTE India', href: 'https://aicte-india.org' },
                                { label: 'NAAC', href: 'https://naac.gov.in' },
                                { label: 'NES (Trust)', href: '#' },
                            ].map(l => (
                                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-cyber transition-colors font-space font-medium">
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
                    <p className="text-[10px] text-white/45 font-space font-medium tracking-wide">
                        © {new Date().getFullYear()} Dept. of Robotics &amp; Artificial Intelligence · JNNCE, Shivamogga. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[10px] text-white/45 hover:text-cyber transition-colors font-orbitron uppercase tracking-widest font-semibold">Admin</Link>
                        <span className="text-[10px] text-white/35 font-space font-medium">VTU Reg. No: PES20AI · Est. 2020</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
