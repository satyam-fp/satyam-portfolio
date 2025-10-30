'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Node3DProps {
  position: [number, number, number];
  type: 'project' | 'blog';
  title: string;
  nodeId: string;
  isSelected?: boolean;
  isConnected?: boolean;
  onHover?: (nodeId: string | null) => void;
  onClick?: (nodeId: string) => void;
}

export function Node3D({ 
  position, 
  type, 
  title, 
  nodeId, 
  isSelected = false,
  isConnected = false,
  onHover,
  onClick 
}: Node3DProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const outerGlowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { } = useThree();

  // Enhanced color scheme with more sophisticated neural network aesthetics
  const colors = useMemo(() => {
    const baseColors = {
      project: {
        base: new Color('#1e40af'), // Deep blue
        hover: new Color('#3b82f6'), // Bright blue
        selected: new Color('#06b6d4'), // Cyan
        glow: new Color('#60a5fa') // Light blue
      },
      blog: {
        base: new Color('#7c3aed'), // Deep purple
        hover: new Color('#a855f7'), // Bright purple
        selected: new Color('#d946ef'), // Magenta
        glow: new Color('#c084fc') // Light purple
      }
    };
    return baseColors[type];
  }, [type]);

  // Get current color based on state
  const getCurrentColor = () => {
    if (isSelected) return colors.selected;
    if (hovered) return colors.hover;
    if (isConnected) return colors.hover.clone().lerp(colors.base, 0.5);
    return colors.base;
  };

  // Enhanced animations with neural network-like behavior
  useFrame((state) => {
    if (meshRef.current && glowRef.current && outerGlowRef.current) {
      const time = state.clock.elapsedTime;
      
      // Enhanced floating animation with interaction feedback
      const floatOffset = Math.sin(time * 0.5 + position[0] * 0.1) * 0.1;
      const interactionFloat = (hovered || isSelected) ? Math.sin(time * 3) * 0.05 : 0;
      meshRef.current.position.y = position[1] + floatOffset + interactionFloat;
      
      // Enhanced rotation based on interaction state with smooth transitions
      const baseRotationSpeed = type === 'project' ? 0.005 : 0.008;
      const interactionSpeedMultiplier = (hovered || isSelected) ? 2.5 : 1;
      const rotationSpeed = baseRotationSpeed * interactionSpeedMultiplier;
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
      
      // Dynamic scaling with smooth spring-like transitions
      const baseScale = 1.0;
      const hoverScale = 1.35;
      const selectedScale = 1.5;
      const connectedScale = 1.15;
      
      let targetScale = baseScale;
      if (isSelected) targetScale = selectedScale;
      else if (hovered) targetScale = hoverScale;
      else if (isConnected) targetScale = connectedScale;
      
      // Smooth spring-like scaling with easing
      const currentScale = meshRef.current.scale.x;
      const scaleDiff = targetScale - currentScale;
      const easeAmount = 0.12 + (Math.abs(scaleDiff) * 0.08); // Adaptive easing
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, easeAmount);
      
      // Enhanced pulsing glow effect with interaction states
      const basePulse = Math.sin(time * 2 + nodeId.length) * 0.1 + 0.9;
      const interactionPulse = (hovered || isSelected) ? Math.sin(time * 4) * 0.2 + 1.2 : 1;
      const pulseIntensity = basePulse * interactionPulse;
      
      const baseGlowIntensity = 0.15;
      const hoverGlowIntensity = 0.5;
      const selectedGlowIntensity = 0.7;
      const connectedGlowIntensity = 0.3;
      
      let targetGlowIntensity = baseGlowIntensity;
      if (isSelected) targetGlowIntensity = selectedGlowIntensity;
      else if (hovered) targetGlowIntensity = hoverGlowIntensity;
      else if (isConnected) targetGlowIntensity = connectedGlowIntensity;
      
      // Smooth glow scaling with breathing effect
      const breathingEffect = Math.sin(time * 1.5) * 0.1;
      const interactionBreathing = (hovered || isSelected) ? Math.sin(time * 2.5) * 0.15 : 0;
      glowRef.current.scale.setScalar(1.2 + breathingEffect + interactionBreathing);
      outerGlowRef.current.scale.setScalar(1.8 + breathingEffect * 1.5 + interactionBreathing * 1.2);
      
      // Update material properties with smooth transitions
      if (meshRef.current.material) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        const currentEmissive = material.emissiveIntensity;
        const targetEmissive = targetGlowIntensity * pulseIntensity;
        material.emissiveIntensity = THREE.MathUtils.lerp(currentEmissive, targetEmissive, 0.1);
      }
      
      // Neural activity particles animation
      if (hovered || isSelected) {
        // Add subtle orbital motion to the entire node
        const orbitalOffset = Math.sin(time * 1.2) * 0.02;
        meshRef.current.position.x = position[0] + orbitalOffset;
        meshRef.current.position.z = position[2] + Math.cos(time * 1.2) * 0.02;
      } else {
        // Return to original position smoothly
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0], 0.1);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, position[2], 0.1);
      }
    }
  });

  // Enhanced interaction handlers with proper raycasting
  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
    onHover?.(nodeId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setHovered(false);
    onHover?.(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick?.(nodeId);
  };

  // Enhanced pointer move handler for better hover detection
  const handlePointerMove = (event: any) => {
    event.stopPropagation();
  };

  const currentColor = getCurrentColor();
  const glowColor = colors.glow;

  return (
    <group position={position}>
      {/* Main node sphere with enhanced raycasting */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        raycast={undefined} // Use default raycasting for accurate detection
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow layer */}
      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={(hovered || isSelected || isConnected) ? 0.3 : 0.1}
        />
      </mesh>

      {/* Outer glow layer */}
      <mesh ref={outerGlowRef} scale={1.8}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={(hovered || isSelected || isConnected) ? 0.15 : 0.03}
        />
      </mesh>

      {/* Node label - only show when hovered or selected */}
      {(hovered || isSelected) && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.3}
          color={currentColor.getHexString()}
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
          textAlign="center"
          font={undefined} // Will use default font for now
        >
          {title}
        </Text>
      )}

      {/* Type indicator - small geometric shape */}
      <mesh position={[0, 0, 0.5]} scale={0.3}>
        {type === 'project' ? (
          <boxGeometry args={[0.3, 0.3, 0.3]} />
        ) : (
          <octahedronGeometry args={[0.2]} />
        )}
        <meshBasicMaterial
          color={currentColor}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Neural activity particles - subtle effect */}
      {(hovered || isSelected) && (
        <group>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 0.8,
                Math.sin((i / 6) * Math.PI * 2) * 0.8,
                0
              ]}
              scale={0.05}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}