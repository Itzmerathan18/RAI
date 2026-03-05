/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // ── Cyber / Neon cyan (primary brand)
                cyber: {
                    DEFAULT: '#00E5FF',
                    dark: '#00B2CC',
                    light: '#80F0FF',
                    50: '#e0faff',
                    100: '#b3f4ff',
                    200: '#80eeff',
                    300: '#4de7ff',
                    400: '#26e2ff',
                    500: '#00E5FF',
                    600: '#00b2cc',
                    700: '#008099',
                    800: '#004d66',
                    900: '#001a33',
                },
                // ── Keep primary/accent for backwards-compat
                primary: {
                    50: '#e0faff',
                    100: '#b3f4ff',
                    200: '#80eeff',
                    300: '#4de7ff',
                    400: '#26e2ff',
                    500: '#00E5FF',
                    600: '#00b2cc',
                    700: '#008099',
                    800: '#004d66',
                    900: '#001a33',
                },
                accent: {
                    300: '#80F0FF',
                    400: '#26e2ff',
                    500: '#00E5FF',
                    600: '#00b2cc',
                },
                dark: {
                    900: '#000000',
                    800: '#0a0a0a',
                    700: '#111111',
                    600: '#1a1a1a',
                    500: '#222222',
                },
                neon: '#39FF14',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
                display: ['Orbitron', 'monospace'],
                orbitron: ['Orbitron', 'monospace'],
                space: ['Space Grotesk', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000d1a 100%)',
                'card-gradient': 'linear-gradient(145deg, rgba(0,229,255,0.06), rgba(0,229,255,0.02))',
                'cyber-gradient': 'linear-gradient(90deg, #00E5FF, #00B2CC)',
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 4s linear infinite',
                'robot-idle': 'robot-idle 3s ease-in-out infinite',
                'joint-pulse': 'joint-pulse 2s ease-in-out infinite',
                'led-blink': 'led-blink 3s step-end infinite',
                'text-shimmer': 'text-shimmer 4s linear infinite',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 229, 255, 0.35)',
                'glow-lg': '0 0 50px rgba(0, 229, 255, 0.3)',
                'glow-sm': '0 0 10px rgba(0, 229, 255, 0.25)',
                'inner-glow': 'inset 0 0 20px rgba(0, 229, 255, 0.1)',
            },
            borderColor: {
                cyber: '#00E5FF',
            },
        }
    },
    plugins: [],
};
