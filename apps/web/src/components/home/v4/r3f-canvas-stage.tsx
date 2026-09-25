'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  scrollRef: React.RefObject<{ progress: number; velocity: number }>;
  autoRotate: boolean;
  isVisible?: boolean;
}

function QuantumParticleField({ count = 280 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.2 + Math.random() * 2.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sc[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, sc];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#a78bfa"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneMeshes({ scrollRef, autoRotate }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const torusRef = useRef<THREE.Mesh>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const innerRingRef = useRef<THREE.Mesh>(null!);

  const baseAngle = useRef(0);
  const smoothedProgress = useRef(0);
  const smoothedVelocity = useRef(0);

  useFrame((_, delta) => {
    if (autoRotate) {
      baseAngle.current += delta * 0.4;
    }

    const targetProgress = scrollRef.current?.progress ?? 0;
    const targetVelocity = Math.min(scrollRef.current?.velocity ?? 0, 10);

    smoothedProgress.current += (targetProgress - smoothedProgress.current) * 0.08;
    smoothedVelocity.current += (targetVelocity - smoothedVelocity.current) * 0.1;

    const angle = baseAngle.current + smoothedProgress.current * Math.PI * 3;
    const velBoost = 1 + smoothedVelocity.current * 0.25;

    // 1. Quantum Torus Knot: Fluid multi-axis inertia
    if (torusRef.current) {
      torusRef.current.rotation.x = 0.4 + Math.sin(angle * 0.4) * 0.2 + smoothedProgress.current * 0.8;
      torusRef.current.rotation.y = angle * 0.65;
      torusRef.current.rotation.z = Math.cos(angle * 0.3) * 0.15;
      torusRef.current.position.y = Math.sin(baseAngle.current * 0.8) * 0.1;
      const s = 1 + Math.sin(angle * 0.5) * 0.03 + (smoothedVelocity.current * 0.02);
      torusRef.current.scale.set(s, s, s);
    }

    // 2. Glowing Inner Core: Reverse rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = -angle * 1.2;
      coreRef.current.rotation.x = angle * 0.8;
      const pulse = 1 + Math.sin(baseAngle.current * 2.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // 3. Dual Gyroscopic Orbit Rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.PI / 3 + angle * 0.25;
      outerRingRef.current.rotation.y = angle * 0.4 * velBoost;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -Math.PI / 3 - angle * 0.3;
      innerRingRef.current.rotation.z = angle * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -3]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[0, 0, 2]} intensity={3.5} distance={8} color="#8b5cf6" />
      <pointLight position={[0, -2, -1]} intensity={2.0} distance={6} color="#06b6d4" />

      {/* Primary Hero Artifact: Frosted Chromatic Torus Knot */}
      <mesh ref={torusRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.15, 0.32, 160, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#0f0728"
          emissive="#6d28d9"
          emissiveIntensity={0.5}
          roughness={0.12}
          metalness={0.25}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Internal Energy Nucleus */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Gyroscope Ring 1 */}
      <mesh ref={outerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.05, 0.018, 16, 100]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#9333ea"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Gyroscope Ring 2 */}
      <mesh ref={innerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.35, 0.014, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Ambient Stardust Particle Field */}
      <QuantumParticleField count={240} />
    </group>
  );
}

export default function R3FCanvasStage(props: SceneProps) {
  return (
    <div className="relative w-full h-full min-h-[460px] bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <SceneMeshes {...props} />
      </Canvas>
    </div>
  );
}
