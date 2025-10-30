'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

import type { Connection3D as Connection3DType } from '@/types/3d';

interface Connection3DProps {
  connection: Connection3DType;
  nodePositions: Map<string, [number, number, number]>;
  isHighlighted?: boolean;
}

export function Connection3D({ connection, nodePositions, isHighlighted = false }: Connection3DProps) {
  const lineRef = useRef(null);
  
  const fromPos = nodePositions.get(connection.from);
  const toPos = nodePositions.get(connection.to);

  // Animate the connection with subtle pulsing - must be called before any early returns
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = Math.sin(time * 2 + connection.strength * 10) * 0.1 + 0.9;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const material = (lineRef.current as any).material;
      if (material && 'opacity' in material) {
        material.opacity = (connection.strength * 0.6 + 0.2) * pulse;
      }
    }
  });

  // Create curved line points for more organic neural network appearance
  const points = useMemo(() => {
    // Don't create points if positions are missing
    if (!fromPos || !toPos) {
      return [];
    }

    const start = new Vector3(...fromPos);
    const end = new Vector3(...toPos);
    
    // Calculate midpoint with slight curve
    const midpoint = start.clone().lerp(end, 0.5);
    const distance = start.distanceTo(end);
    
    // Add curve based on connection strength and distance
    const curveHeight = Math.min(distance * 0.2 * connection.strength, 2.0);
    const perpendicular = new Vector3(0, 1, 0);
    
    // Create slight randomness in curve direction
    const randomOffset = new Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    );
    
    midpoint.add(perpendicular.multiplyScalar(curveHeight)).add(randomOffset);
    
    // Create smooth curve with multiple points
    const curvePoints: Vector3[] = [];
    const segments = 16;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      
      // Quadratic Bezier curve
      const point = new Vector3()
        .addScaledVector(start, (1 - t) * (1 - t))
        .addScaledVector(midpoint, 2 * (1 - t) * t)
        .addScaledVector(end, t * t);
      
      curvePoints.push(point);
    }
    
    return curvePoints;
  }, [fromPos, toPos, connection.strength]);

  // Don't render if no points
  if (points.length === 0) {
    return null;
  }

  // Color based on connection strength and highlight state
  const getConnectionColor = () => {
    if (isHighlighted) return '#00ffff'; // Bright cyan when highlighted
    
    // Gradient from blue to purple based on strength
    const strength = connection.strength;
    const r = Math.floor(64 + strength * 128); // 64 to 192
    const g = Math.floor(32 + strength * 64);  // 32 to 96
    const b = Math.floor(128 + strength * 127); // 128 to 255
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Line
      ref={lineRef}
      points={points}
      color={getConnectionColor()}
      lineWidth={connection.strength * 3 + 0.5} // Thickness based on strength
      transparent
      opacity={connection.strength * 0.6 + 0.2}
    />
  );
}

// Component for rendering all connections
interface ConnectionNetworkProps {
  connections: Connection3DType[];
  nodePositions: Map<string, [number, number, number]>;
  highlightedNodeId?: string | null;
}

export function ConnectionNetwork({ 
  connections, 
  nodePositions, 
  highlightedNodeId 
}: ConnectionNetworkProps) {
  return (
    <group>
      {connections.map((connection, index) => {
        const isHighlighted = Boolean(highlightedNodeId && 
          (connection.from === highlightedNodeId || connection.to === highlightedNodeId));
        
        return (
          <Connection3D
            key={`${connection.from}-${connection.to}-${index}`}
            connection={connection}
            nodePositions={nodePositions}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </group>
  );
}