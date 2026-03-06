import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
    title: 'Department of RAI | JNNCE Shivamogga',
    description: 'Robotics & Artificial Intelligence department at Jawaharlal Nehru National College of Engineering, Shivamogga – a premier engineering department training the next generation of robotics and AI engineers.',
    keywords: ['JNNCE', 'Robotics', 'AI', 'Engineering', 'Shivamogga', 'VTU'],
    openGraph: {
        title: 'Dept. of Robotics & AI | JNNCE',
        description: 'Engineering Intelligent Machines for the Future',
        type: 'website'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ThemeProvider>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                    <Toaster position="top-right" toastOptions={{
                        style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(0,229,255,0.2)' }
                    }} />
                </ThemeProvider>
            </body>
        </html>
    );
}-
