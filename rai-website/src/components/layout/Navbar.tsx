'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
        label: 'Department', href: '/about',
        children: [
            { label: 'About Department', href: '/about' },
            { label: 'Vision & Mission', href: '/about#vision' },
            { label: 'PEO · PO · PSO', href: '/about#outcomes' },
            { label: 'Programme Overview', href: '/academics' },
        ],
    },
    {
        label: 'Research', href: '/research',
        children: [
            { label: 'Research Areas', href: '/research' },
            { label: 'Publications', href: '/research#publications' },
            { label: 'Funded Projects', href: '/research#projects' },
        ],
    },
    { label: 'Labs', href: '/labs' },
    {
        label: 'Projects', href: '/projects',
        children: [
            { label: 'Student Projects', href: '/projects' },
            { label: 'Achievements', href: '/achievements' },
            { label: 'Placements', href: '/placements' },
        ],
    },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMobileOpen(false), [pathname]);

    // Hide Navbar on Admin pages
    if (pathname.startsWith('/admin')) {
        return null;
    }

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    const navBg = scrolled
        ? 'bg-black/97 backdrop-blur-xl border-b border-cyan-500/15 shadow-[0_1px_0_rgba(0,229,255,0.08)]'
        : 'bg-transparent backdrop-blur-sm border-b border-white/0';

    const linkBase = 'px-2.5 py-2 rounded-lg text-xs font-rajdhani font-medium tracking-wider uppercase transition-all duration-200';
    const linkActive = `${linkBase} text-cyan-400 font-semibold`;
    const linkDefault = `${linkBase} text-white/50 hover:text-white`;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all flex-shrink-0 overflow-hidden">
                        <img src="/images/jnnce-logo.png" alt="JNNCE" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="hidden sm:block">
                        <div className="font-orbitron font-bold text-[11px] leading-none tracking-widest uppercase text-white">
                            JNNCE
                        </div>
                        <div className="text-[10px] tracking-widest uppercase font-rajdhani text-gold mt-0.5">
                            Shivamogga
                        </div>
                    </div>
                </Link>

                {/* ── Desktop Nav ── */}
                <div className="hidden lg:flex items-center gap-0">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div key={link.label} className="relative"
                                onMouseEnter={() => setOpenDropdown(link.label)}
                                onMouseLeave={() => setOpenDropdown(null)}>
                                <button className={`flex items-center gap-1 ${isActive(link.href) ? linkActive : linkDefault}`}>
                                    {link.label}
                                    <FiChevronDown className={`w-3 h-3 transition-transform ${openDropdown === link.label ? 'rotate-180 text-gold' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openDropdown === link.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-1 w-52 bg-black border border-gold/15 rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(234,179,8,0.1)]">
                                            {link.children.map((child) => (
                                                <Link key={child.href} href={child.href}
                                                    className="block px-4 py-2.5 text-xs text-white/50 hover:text-gold hover:bg-gold/5 transition-all font-rajdhani tracking-wide border-b border-white/4 last:border-0">
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href}
                                className={isActive(link.href) ? linkActive : linkDefault}>
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* ── Right cluster ── */}
                <div className="flex items-center gap-2">
                    <a href="https://jnnce.ac.in" target="_blank" rel="noreferrer"
                        className="hidden lg:flex items-center gap-1 text-xs font-orbitron tracking-wider uppercase transition-colors hover:text-gold text-white/25">
                        JNNCE <FiExternalLink className="w-3 h-3" />
                    </a>
                    <Link href="/admin" className="btn-primary !text-xs !py-1.5 !px-3 hidden sm:inline-flex">
                        Admin
                    </Link>
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-lg transition-colors hover:text-gold text-white/40">
                        {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-gold/10 bg-black/98 overflow-hidden">
                        <div className="px-4 py-4 space-y-0.5 max-h-[70vh] overflow-y-auto">
                            {navLinks.map((link) => (
                                <div key={link.href}>
                                    <Link href={link.href}
                                        className={`block px-3 py-2.5 rounded-lg text-sm font-rajdhani tracking-wide transition-all ${isActive(link.href)
                                            ? 'text-gold bg-gold/5 border border-gold/15'
                                            : 'text-white/45 hover:text-white hover:bg-white/3'
                                            }`}>
                                        {link.label}
                                    </Link>
                                    {link.children && (
                                        <div className="pl-4 mt-0.5 space-y-0.5">
                                            {link.children.map(child => (
                                                <Link key={child.href} href={child.href}
                                                    className="block px-3 py-2 rounded-lg text-xs hover:text-gold hover:bg-gold/5 transition-all font-rajdhani text-white/30">
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="pt-3">
                                <Link href="/admin" className="btn-primary w-full justify-center text-sm">Admin Portal</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
