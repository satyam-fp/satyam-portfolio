'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import * as THREE from 'three';

interface NeuronAnimationProps {
  intensity?: number;
}

export function NeuronAnimation({ intensity = 1 }: NeuronAnimationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const centralNodeRef = useRef<Mesh>(null);
  const connectionRefs = useRef<Mesh[]>([]);

  // Generate neuron structure
  const neuronData = useMemo(() => {
    const branches = 8;
    const connections = [];
    
    for (let i = 0; i < branches; i++) {
      const angle = (i / branches) * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 2;
      
      connections.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number],
        delay: i * 0.2,
        length: radius
      });
    }
    
    return connections;
  }, []);

  // Colors for the neural network
  const colors = {
    central: new Color('#06b6d4'), // Cyan
    branch: new Color('#3b82f6'),  // Blue
    pulse: new Color('#60a5fa')    // Light blue
  };

  useFrame((state) => {
    const time = state.clock.elapsedTime * intensity;
    
    // Rotate the entire neuron slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }
    
    // Pulse the central node
    if (centralNodeRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      centralNodeRef.current.scale.setScalar(pulse);
      
      // Update emissive intensity
      const material = centralNodeRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
    }
    
    // Animate connection pulses
    connectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const connection = neuronData[index];
        const pulseTime = time + connection.delay;
        const pulse = Math.sin(pulseTime * 1.5) * 0.5 + 0.5;
        
        // Scale the connection based on pulse
        ref.scale.setScalar(0.8 + pulse * 0.4);
        
        // Update material opacity
        const material = ref.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + pulse * 0.4;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Central neuron body */}
      <mesh ref={centralNodeRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={colors.central}
          emissive={colors.central}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Neuron branches and connections */}
      {neuronData.map((connection, index) => (
        <group key={index}>
          {/* Branch endpoint */}
          <mesh
            position={connection.position}
            ref={(el) => {
              if (el) connectionRefs.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={colors.branch}
              transparent
              opacity={0.6}
            />
          </mesh>
          
          {/* Connection line */}
          <mesh
            position={[
              connection.position[0] * 0.5,
              connection.position[1] * 0.5,
              connection.position[2] * 0.5
            ]}
            rotation={[
              0,
              Math.atan2(connection.position[2], connection.position[0]),
              Math.atan2(connection.position[1], Math.sqrt(connection.position[0] ** 2 + connection.position[2] ** 2))
            ]}
          >
            <cylinderGeometry args={[0.02, 0.02, connection.length, 8]} />
            <meshBasicMaterial
              color={colors.pulse}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Subtle particle effects around the neuron */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 6
          ]}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial
            color={colors.pulse}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}