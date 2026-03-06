'use client';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/35 font-space mb-6 flex-wrap">
            <Link href="/" className="flex items-center gap-1 hover:text-cyber transition-colors">
                <FiHome className="w-3 h-3" />
                <span>Home</span>
            </Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <FiChevronRight className="w-3 h-3 text-white/20" />
                    {item.href && i < items.length - 1 ? (
                        <Link href={item.href} className="hover:text-cyber transition-colors">{item.label}</Link>
                    ) : (
                        <span className="text-white/60">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
