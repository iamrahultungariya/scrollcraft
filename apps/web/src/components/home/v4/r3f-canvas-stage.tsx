'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  scrollRef: React.RefObject<{ progress: number; velocity: number }>;
  autoRotate: boolean;
  isVisible?: boolean;
}

function SceneMeshes({ scrollRef, autoRotate }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const centerMeshRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const orbiter1Ref = useRef<THREE.Mesh>(null!);
  const orbiter2Ref = useRef<THREE.Mesh>(null!);

  // Interpolated smooth values for 120 FPS silky physics
  const baseAngle = useRef(0);
  const smoothedProgress = useRef(0);

  useFrame((_, delta) => {
    if (autoRotate) {
      baseAngle.current += delta * 0.45;
    }

    const targetProgress = scrollRef.current?.progress ?? 0;
    smoothedProgress.current += (targetProgress - smoothedProgress.current) * 0.08;

    const angle = baseAngle.current + smoothedProgress.current * Math.PI * 2;

    // 1. Central Spatial Monolith: Multi-axis rotation with breathing float
    if (centerMeshRef.current) {
      centerMeshRef.current.rotation.y = angle * 0.8;
      centerMeshRef.current.rotation.x = 0.35 + Math.sin(angle * 0.5) * 0.08;
      centerMeshRef.current.rotation.z = Math.cos(angle * 0.4) * 0.05;
      centerMeshRef.current.position.y = Math.sin(baseAngle.current * 0.8) * 0.08;
    }

    // 2. Inner Luminescent Core (spins counter to outer shell)
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -angle * 1.2;
      innerCoreRef.current.rotation.z = angle * 0.6;
      const pulse = 1 + Math.sin(baseAngle.current * 2) * 0.06;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // 3. Precision Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(angle * 0.3) * 0.1;
      ring1Ref.current.rotation.y = angle * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(angle * 0.25) * 0.1;
      ring2Ref.current.rotation.y = -angle * 0.4;
    }

    // 4. Satellite Prism 1 (Upper Left Orbit)
    if (orbiter1Ref.current) {
      const radius = 2.4;
      orbiter1Ref.current.position.x = Math.cos(angle * 0.7) * radius;
      orbiter1Ref.current.position.z = Math.sin(angle * 0.7) * radius * 0.8;
      orbiter1Ref.current.position.y = 1.1 + Math.sin(angle * 0.5) * 0.2;
      orbiter1Ref.current.rotation.x = angle * 1.1;
      orbiter1Ref.current.rotation.y = angle * 0.9;
    }

    // 5. Satellite Prism 2 (Lower Right Orbit)
    if (orbiter2Ref.current) {
      const radius = 2.6;
      orbiter2Ref.current.position.x = Math.cos(angle * 0.7 + Math.PI) * radius;
      orbiter2Ref.current.position.z = Math.sin(angle * 0.7 + Math.PI) * radius * 0.8;
      orbiter2Ref.current.position.y = -1.0 + Math.cos(angle * 0.5) * 0.2;
      orbiter2Ref.current.rotation.x = -angle * 0.8;
      orbiter2Ref.current.rotation.z = angle * 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Studio Lighting Hierarchy */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[0, 0, 1.8]} intensity={4.5} distance={10} color="#8b5cf6" />
      <pointLight position={[0, 2, -2]} intensity={2.5} distance={8} color="#38bdf8" />

      {/* 1. Outer Spatial Monolith (Electric Violet Frosted Glass) */}
      <mesh ref={centerMeshRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          color="#1e1338"
          emissive="#7c3aed"
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 2. Inner Glowing Core (Electric Violet Star) */}
      <mesh ref={innerCoreRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#8b5cf6"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 3. Primary Energy Orbital Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.9, 0.016, 16, 120]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 4. Secondary Counter-Tilted Datum Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.3, 0.012, 16, 120]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>

      {/* 5. Precision Satellite Node 1 */}
      <mesh ref={orbiter1Ref} scale={0.42}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#27272a"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* 6. Precision Satellite Node 2 */}
      <mesh ref={orbiter2Ref} scale={0.38}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#18181b"
          emissive="#38bdf8"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export default function R3FCanvasStage({ scrollRef, autoRotate, isVisible = true }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      dpr={[1, 1.5]}
      className="w-full h-full"
      frameloop={isVisible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        const handleContextLost = (event: Event) => {
          event.preventDefault();
        };
        canvas.addEventListener('webglcontextlost', handleContextLost, false);
      }}
    >
      <SceneMeshes scrollRef={scrollRef} autoRotate={autoRotate} />
    </Canvas>
  );
}
