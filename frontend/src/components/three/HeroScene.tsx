'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CYBER_CYAN = new THREE.Color('#00E5FF');
const CYBER_DARK = new THREE.Color('#00B2CC');

function CyberGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
      }
    }
  });
  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, CYBER_CYAN, CYBER_CYAN]}
      position={[0, -2, -8]}
      rotation={[-Math.PI / 2.8, 0, 0]}
    />
  );
}

function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });
  return (
    <mesh ref={meshRef} position={[2, 0.5, -6]}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshBasicMaterial color={CYBER_CYAN} wireframe transparent opacity={0.2} />
    </mesh>
  );
}

function FloatingRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <mesh ref={meshRef} position={[-2.2, -0.3, -5]}>
      <torusGeometry args={[0.8, 0.03, 32, 64]} />
      <meshBasicMaterial color={CYBER_CYAN} transparent opacity={0.25} />
    </mesh>
  );
}

function WireframeIco() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 1.2, -7]} scale={0.7}>
      <icosahedronGeometry args={[0.9, 1]} />
      <meshBasicMaterial color={CYBER_CYAN} wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function ParticleField() {
  const count = 280;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 12;
      pos[i + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    return pos;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={CYBER_CYAN}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HorizonRays() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  const rays = useMemo(() => {
    const r: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      r.push({
        position: [Math.cos(angle) * 0.5, -1.5, -9],
        scale: [0.002, 2 + Math.random() * 1.5, 0.002],
      });
    }
    return r;
  }, []);
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {rays.map((r, i) => (
        <mesh key={i} position={r.position as [number, number, number]}>
          <boxGeometry args={r.scale} />
          <meshBasicMaterial color={CYBER_CYAN} transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 4, 18]} />
      <ambientLight intensity={0.4} />
      <pointLight color={CYBER_CYAN} position={[3, 2, 2]} intensity={0.6} />
      <pointLight color={CYBER_DARK} position={[-2, -1, 1]} intensity={0.3} />
      <CyberGrid />
      <FloatingTorus />
      <FloatingRing />
      <WireframeIco />
      <ParticleField />
      <HorizonRays />
    </>
  );
}
