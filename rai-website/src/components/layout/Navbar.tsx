'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX, FiExternalLink, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
        label: 'Academics', href: '/academics',
        children: [
            { label: 'Programme Overview', href: '/academics' },
            { label: 'Curriculum / Syllabus', href: '/academics#curriculum' },
            { label: 'PEO · PO · PSO', href: '/about#outcomes' },
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
    { label: 'Faculty', href: '/faculty' },
    { label: 'Labs', href: '/labs' },
    {
        label: 'Students', href: '/students',
        children: [
            { label: 'Student Projects', href: '/projects' },
            { label: 'Achievements', href: '/achievements' },
            { label: 'Placements', href: '/placements' },
            { label: 'Alumni', href: '/alumni' },
        ],
    },
    { label: 'Gallery', href: '/gallery' },   // ← now visible on desktop
    { label: 'Notices', href: '/notices' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    const isDark = theme === 'dark';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMobileOpen(false), [pathname]);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    // Desktop primary links (show first 8 = Home→Gallery)
    const desktopLinks = navLinks.slice(0, 9);

    const navBg = scrolled
        ? isDark
            ? 'bg-black/97 backdrop-blur-xl border-b border-cyber/15 shadow-[0_1px_0_rgba(0,229,255,0.1)]'
            : 'bg-white/97 backdrop-blur-xl border-b border-black/10 shadow-sm'
        : isDark
            ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
            : 'bg-white/85 backdrop-blur-md border-b border-black/5';

    const linkStyle = (active: boolean) =>
        `px-2.5 py-2 rounded-lg text-xs font-space font-medium transition-all duration-200 ${active
            ? 'text-cyber'
            : isDark ? 'text-white/45 hover:text-white' : 'text-black/45 hover:text-black'}`;

    const dropStyle = isDark
        ? 'bg-black border border-cyber/15 rounded-xl overflow-hidden shadow-glow'
        : 'bg-white border border-black/10 rounded-xl overflow-hidden shadow-lg';

    const dropLinkStyle = isDark
        ? 'block px-4 py-2.5 text-xs text-white/50 hover:text-cyber hover:bg-cyber/5 transition-all font-space border-b border-white/4 last:border-0'
        : 'block px-4 py-2.5 text-xs text-black/50 hover:text-cyber hover:bg-cyber/5 transition-all font-space border-b border-black/5 last:border-0';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-cyber flex items-center justify-center font-orbitron font-black text-black text-sm shadow-glow group-hover:shadow-glow-lg transition-all">
                        R
                    </div>
                    <div className="hidden sm:block">
                        <div className={`font-orbitron font-bold text-xs leading-none tracking-wider uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                            Dept. of RAI
                        </div>
                        <div className={`text-[10px] tracking-widest uppercase font-space ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                            JNNCE, Shivamogga
                        </div>
                    </div>
                </Link>

                {/* ── Desktop Nav ── */}
                <div className="hidden lg:flex items-center gap-0.5">
                    {desktopLinks.map((link) =>
                        link.children ? (
                            <div key={link.label} className="relative"
                                onMouseEnter={() => setOpenDropdown(link.label)}
                                onMouseLeave={() => setOpenDropdown(null)}>
                                <button className={`flex items-center gap-1 ${linkStyle(isActive(link.href))}`}>
                                    {link.label}
                                    <FiChevronDown className={`w-3 h-3 transition-transform ${openDropdown === link.label ? 'rotate-180 text-cyber' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openDropdown === link.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                                            className={`absolute top-full left-0 mt-1 w-48 ${dropStyle}`}>
                                            {link.children.map((child) => (
                                                <Link key={child.href} href={child.href} className={dropLinkStyle}>
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href} className={linkStyle(isActive(link.href))}>
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* ── Right cluster ── */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className={`p-2 rounded-lg transition-all duration-300 border ${isDark
                                ? 'border-white/10 text-white/40 hover:text-cyber hover:border-cyber/30'
                                : 'border-black/10 text-black/40 hover:text-cyber hover:border-cyber/30'
                            }`}>
                        <AnimatePresence mode="wait">
                            {isDark ? (
                                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <FiSun className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <FiMoon className="w-4 h-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    <a href="https://jnnce.ac.in" target="_blank" rel="noreferrer"
                        className={`hidden lg:flex items-center gap-1 text-xs font-orbitron tracking-wider uppercase transition-colors hover:text-cyber ${isDark ? 'text-white/25' : 'text-black/25'}`}>
                        JNNCE <FiExternalLink className="w-3 h-3" />
                    </a>
                    <Link href="/admin" className="btn-primary !text-xs !py-1.5 !px-3 hidden sm:inline-flex">
                        Admin
                    </Link>
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors hover:text-cyber ${isDark ? 'text-white/40' : 'text-black/40'}`}>
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
                        className={`lg:hidden border-t overflow-hidden ${isDark ? 'bg-black border-cyber/10' : 'bg-white border-black/8'}`}>
                        <div className="px-4 py-4 space-y-0.5 max-h-[70vh] overflow-y-auto">
                            {navLinks.map((link) => (
                                <div key={link.href}>
                                    <Link href={link.href}
                                        className={`block px-3 py-2.5 rounded-lg text-sm font-space transition-all ${isActive(link.href)
                                            ? 'text-cyber bg-cyber/5 border border-cyber/15'
                                            : isDark ? 'text-white/45 hover:text-white hover:bg-white/3' : 'text-black/45 hover:text-black hover:bg-black/3'
                                            }`}>
                                        {link.label}
                                    </Link>
                                    {link.children && (
                                        <div className="pl-4 mt-0.5 space-y-0.5">
                                            {link.children.map(child => (
                                                <Link key={child.href} href={child.href}
                                                    className={`block px-3 py-2 rounded-lg text-xs hover:text-cyber hover:bg-cyber/4 transition-all font-space ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Theme toggle in mobile */}
                            <div className={`flex items-center gap-3 px-3 py-2.5 border-t mt-2 pt-3 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                <span className={`text-sm font-space ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                                    {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                                </span>
                                <button onClick={toggleTheme} className="ml-auto btn-secondary !text-xs !py-1 !px-3">
                                    Switch
                                </button>
                            </div>
                            <div className="pt-2">
                                <Link href="/admin" className="btn-primary w-full justify-center text-sm">Admin Portal</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
