'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { PointLight } from 'three';

export function SceneSetup() {
  const dynamicLightRef = useRef<PointLight>(null);
  const accentLightRef = useRef<PointLight>(null);

  // Animate lights for dynamic neural network atmosphere
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (dynamicLightRef.current) {
      // Slowly orbit the dynamic light
      dynamicLightRef.current.position.x = Math.cos(time * 0.2) * 8;
      dynamicLightRef.current.position.z = Math.sin(time * 0.2) * 8;
      dynamicLightRef.current.intensity = 0.4 + Math.sin(time * 0.5) * 0.2;
    }
    
    if (accentLightRef.current) {
      // Subtle pulsing for accent light
      accentLightRef.current.intensity = 0.3 + Math.sin(time * 1.2) * 0.1;
    }
  });

  return (
    <>
      {/* Low ambient lighting for neural network atmosphere */}
      <ambientLight intensity={0.15} color="#0f172a" />
      
      {/* Main directional light - cool blue tone */}
      <directionalLight
        position={[12, 8, 6]}
        intensity={0.6}
        color="#3b82f6"
        castShadow
      />
      
      {/* Secondary fill light - warm purple */}
      <directionalLight
        position={[-8, -6, -4]}
        intensity={0.4}
        color="#8b5cf6"
      />
      
      {/* Dynamic orbiting light for movement */}
      <pointLight
        ref={dynamicLightRef}
        position={[8, 4, 0]}
        intensity={0.4}
        color="#06b6d4"
        distance={25}
        decay={1.5}
      />
      
      {/* Accent light for highlights */}
      <pointLight
        ref={accentLightRef}
        position={[0, 0, 12]}
        intensity={0.3}
        color="#f59e0b"
        distance={20}
        decay={2}
      />
      
      {/* Subtle rim lighting */}
      <directionalLight
        position={[0, 0, -15]}
        intensity={0.2}
        color="#ec4899"
      />
      
      {/* Neural network grid background */}
      <mesh position={[0, 0, -15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshBasicMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.03}
        />
      </mesh>
      
      {/* Coordinate system helpers (visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* X-axis (red) */}
          <mesh position={[8, 0, 0]}>
            <boxGeometry args={[16, 0.02, 0.02]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
          </mesh>
          
          {/* Y-axis (green) */}
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[0.02, 12, 0.02]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
          </mesh>
          
          {/* Z-axis (blue) */}
          <mesh position={[0, 0, 8]}>
            <boxGeometry args={[0.02, 0.02, 16]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
          </mesh>
          
          {/* Origin marker */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </>
  );
}