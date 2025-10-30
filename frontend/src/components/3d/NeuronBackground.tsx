'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NeuronAnimation } from './NeuronAnimation';

interface NeuronBackgroundProps {
  className?: string;
  intensity?: number;
}

export function NeuronBackground({ className = '', intensity = 1 }: NeuronBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#3b82f6" />
          
          {/* Neuron Animation */}
          <NeuronAnimation intensity={intensity} />
          
          {/* Optional controls for interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}