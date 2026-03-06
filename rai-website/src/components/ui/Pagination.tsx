'use client';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    page: number;
    pages: number;
    onPageChange: (p: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
    if (pages <= 1) return null;

    const range = Array.from({ length: Math.min(pages, 7) }, (_, i) => {
        if (pages <= 7) return i + 1;
        if (page <= 4) return i + 1;
        if (page >= pages - 3) return pages - 6 + i;
        return page - 3 + i;
    });

    return (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-xl border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <FiChevronLeft className="w-4 h-4" />
            </button>

            {range.map(n => (
                <button
                    key={n}
                    onClick={() => onPageChange(n)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${n === page
                            ? 'bg-cyber/10 border border-cyber/40 text-cyber'
                            : 'border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber'
                        }`}
                >
                    {n}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                className="p-2 rounded-xl border border-white/10 text-white/40 hover:border-cyber/30 hover:text-cyber transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <FiChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
