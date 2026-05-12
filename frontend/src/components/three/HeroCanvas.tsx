'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const HeroScene = dynamic(
  () => import('./HeroScene').then((mod) => mod.default),
  { ssr: false }
);

function Fallback() {
  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={<Fallback />}>
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
