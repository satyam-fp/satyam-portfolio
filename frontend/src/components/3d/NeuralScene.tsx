'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import React, { Suspense, useState, useMemo, useRef, useCallback } from 'react';
import { Node3D } from './Node3D';
import { ConnectionNetwork } from './Connection3D';
import { SceneSetup } from './SceneSetup';
import { Sidebar } from './Sidebar';
import { NeuralGrid2D } from './NeuralGrid2D';
import { useDeviceCapabilities, shouldUse3D, shouldUseReducedEffects } from './MobileDetector';
import { generateNeuralPositions } from '@/lib/neuralPositioning';
import { NeuralNetworkData } from '@/types/3d';
import * as THREE from 'three';

interface ProjectData {
  id: number | string;
  title: string;
  slug: string;
  description?: string;
  tech_stack?: string[];
  techStack?: string[];
  github_url?: string;
  live_demo?: string;
  image_url?: string;
  created_at: string;
}

interface BlogData {
  id: number | string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  created_at: string;
}

interface NeuralSceneProps {
  className?: string;
  projects?: ProjectData[];
  blogs?: BlogData[];
}

// Enhanced sample data with more realistic content for positioning algorithm
const sampleProjects: ProjectData[] = [
  {
    id: 1,
    title: 'Neural Mesh Reconstruction',
    description: 'Deep learning pipeline for reconstructing 3D meshes from sparse point clouds using Graph Neural Networks. This project implements state-of-the-art techniques for 3D reconstruction with applications in autonomous driving and robotics.',
    tech_stack: ['Python', 'PyTorch', 'Open3D', 'CUDA'],
    slug: 'neural-mesh-reconstruction',
    // Note: These are demo URLs - replace with actual project URLs
    github_url: undefined, // Remove placeholder URLs that lead to 404s
    live_demo: undefined,
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    title: 'Real-time Style Transfer',
    description: 'GPU-accelerated neural style transfer system for real-time 3D scene rendering. Achieves 60fps performance on modern GPUs with minimal quality loss.',
    tech_stack: ['C++', 'CUDA', 'OpenGL', 'PyTorch'],
    slug: 'realtime-style-transfer',
    github_url: undefined,
    live_demo: undefined,
    created_at: '2024-02-20T00:00:00Z'
  },
  {
    id: 3,
    title: 'Volumetric Pose Estimation',
    description: 'Multi-view 3D human pose estimation using volumetric representations and transformer architecture. Handles occlusions and complex poses with high accuracy.',
    tech_stack: ['Python', 'TensorFlow', 'OpenCV', 'NumPy'],
    slug: 'volumetric-pose-estimation',
    github_url: undefined,
    live_demo: undefined,
    created_at: '2024-03-10T00:00:00Z'
  },
  {
    id: 4,
    title: 'NeRF Scene Optimization',
    description: 'Optimized Neural Radiance Fields implementation with custom sampling strategies. Reduces training time by 40% while maintaining visual quality.',
    tech_stack: ['Python', 'JAX', 'Optax', 'Matplotlib'],
    slug: 'nerf-optimization',
    github_url: undefined,
    created_at: '2024-04-05T00:00:00Z'
  }
];

const sampleBlogs: BlogData[] = [
  {
    id: 1,
    title: 'Getting Started with Neural Radiance Fields',
    summary: 'A comprehensive guide to understanding and implementing NeRF from scratch.',
    content: 'Neural Radiance Fields have revolutionized 3D scene reconstruction by enabling photorealistic novel view synthesis from sparse input views. In this comprehensive guide, we\'ll explore the mathematical foundations, implementation details, and practical applications of NeRF technology. We\'ll start with the core concepts of volumetric rendering and neural networks, then dive into the specific architecture that makes NeRF so powerful.',
    slug: 'getting-started-with-nerf',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 2,
    title: 'Optimizing 3D Deep Learning Pipelines',
    summary: 'Performance optimization techniques for 3D deep learning models.',
    content: 'Working with 3D data presents unique challenges in deep learning due to the increased computational complexity and memory requirements. This article covers essential optimization techniques including efficient data structures, GPU memory management, and algorithmic improvements that can significantly speed up your 3D ML workflows.',
    slug: 'optimizing-3d-deep-learning',
    created_at: '2024-02-25T00:00:00Z'
  },
  {
    id: 3,
    title: 'Building Production-Ready 3D ML Systems',
    summary: 'Lessons learned from deploying 3D machine learning models in production.',
    content: 'Deploying 3D ML models in production comes with unique challenges including model optimization, inference scaling, and handling diverse input formats. This post shares practical insights from building and maintaining 3D computer vision systems at scale, covering everything from model compression to real-time inference optimization.',
    slug: 'production-3d-ml-systems',
    created_at: '2024-03-15T00:00:00Z'
  }
];

// Enhanced camera controller component with smooth transitions and easing
function CameraController({
  selectedNodePosition,
  onTransitionComplete
}: {
  selectedNodePosition: [number, number, number] | null;
  onTransitionComplete?: () => void;
}) {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { camera } = useThree();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced camera transition with multiple easing options
  const handleCameraTransition = useCallback(async (position: [number, number, number]) => {
    if (!cameraControlsRef.current || isTransitioning) return;

    setIsTransitioning(true);
    
    // Calculate optimal camera position with dynamic distance based on scene bounds
    const [x, y, z] = position;
    const baseDistance = 6;
    const dynamicDistance = baseDistance + Math.abs(z) * 0.3; // Adjust distance based on node depth
    
    // Create multiple viewing angles for variety
    const viewingAngles = [
      new THREE.Vector3(3, 2, dynamicDistance),     // Default angle
      new THREE.Vector3(-2, 3, dynamicDistance),    // Left-high angle
      new THREE.Vector3(4, -1, dynamicDistance),    // Right-low angle
      new THREE.Vector3(0, 4, dynamicDistance),     // Top-down angle
    ];
    
    // Choose angle based on node position to avoid collisions
    const angleIndex = Math.abs(Math.floor(x + y + z)) % viewingAngles.length;
    const offset = viewingAngles[angleIndex];
    
    const targetPosition = new THREE.Vector3(x, y, z).add(offset);
    const lookAtPosition = new THREE.Vector3(x, y, z);

    try {
      // Enhanced smooth transition with custom easing
      const controls = cameraControlsRef.current;
      
      // Set custom transition duration based on distance
      const currentPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
      const distance = currentPos.distanceTo(targetPosition);
      const duration = Math.min(Math.max(distance * 0.2, 0.8), 2.5); // Dynamic duration
      
      await controls.setLookAt(
        targetPosition.x, targetPosition.y, targetPosition.z,
        lookAtPosition.x, lookAtPosition.y, lookAtPosition.z,
        true // Enable smooth transition
      );
      
      // Add a slight delay for the animation to complete
      setTimeout(() => {
        setIsTransitioning(false);
        onTransitionComplete?.();
      }, duration * 1000);
      
    } catch (error) {
      console.warn('Camera transition failed:', error);
      setIsTransitioning(false);
      onTransitionComplete?.();
    }
  }, [camera, isTransitioning, onTransitionComplete]);

  // Enhanced camera reset with smooth return animation
  const resetCamera = useCallback(async () => {
    if (!cameraControlsRef.current || isTransitioning) return;

    setIsTransitioning(true);

    try {
      const controls = cameraControlsRef.current;
      
      // Smooth return to overview position with slight randomization
      const overviewPositions = [
        [0, 0, 15],
        [-2, 3, 14],
        [3, -1, 16],
        [0, 5, 13],
      ];
      
      const randomIndex = Math.floor(Math.random() * overviewPositions.length);
      const [px, py, pz] = overviewPositions[randomIndex];
      
      await controls.setLookAt(
        px, py, pz,  // Camera position with slight variation
        0, 0, 0,     // Look at center
        true
      );
      
      setTimeout(() => {
        setIsTransitioning(false);
        onTransitionComplete?.();
      }, 1500);
      
    } catch (error) {
      console.warn('Camera reset failed:', error);
      setIsTransitioning(false);
      onTransitionComplete?.();
    }
  }, [isTransitioning, onTransitionComplete]);

  // Trigger camera movement when selectedNodePosition changes
  React.useEffect(() => {
    if (selectedNodePosition) {
      handleCameraTransition(selectedNodePosition);
    } else {
      resetCamera();
    }
  }, [selectedNodePosition, handleCameraTransition, resetCamera]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={3}
      maxDistance={30}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
      // Enhanced camera controls settings
      mouseButtons={{
        left: 1,   // Rotate
        middle: 2, // Zoom
        right: 0,  // Pan
        wheel: 16, // Zoom
      }}
      touches={{
        one: 32,   // Rotate
        two: 512,  // Zoom and pan
        three: 0,
      }}
      // Smooth damping for better feel
      dampingFactor={0.05}
      draggingDampingFactor={0.25}
      azimuthRotateSpeed={0.5}
      polarRotateSpeed={0.5}
      dollySpeed={0.5}
      truckSpeed={0.5}
    />
  );
}

export function NeuralScene({ className, projects = sampleProjects, blogs = sampleBlogs }: NeuralSceneProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [cameraTransitioning, setCameraTransitioning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Device capability detection
  const deviceCapabilities = useDeviceCapabilities();
  const use3D = shouldUse3D(deviceCapabilities);
  const useReducedEffects = shouldUseReducedEffects(deviceCapabilities);

  // Generate neural network layout using the positioning algorithm
  const neuralData: NeuralNetworkData = useMemo(() => {
    return generateNeuralPositions(projects, blogs);
  }, [projects, blogs]);

  // Create position map for connections
  const nodePositions = useMemo(() => {
    const positions = new Map<string, [number, number, number]>();
    neuralData.nodes.forEach(node => {
      positions.set(node.id, node.position);
    });
    return positions;
  }, [neuralData.nodes]);

  // Get connected node IDs for highlighting
  const getConnectedNodeIds = useCallback((nodeId: string | null): Set<string> => {
    if (!nodeId) return new Set();

    const connected = new Set<string>();
    neuralData.connections.forEach(connection => {
      if (connection.from === nodeId) {
        connected.add(connection.to);
      } else if (connection.to === nodeId) {
        connected.add(connection.from);
      }
    });
    return connected;
  }, [neuralData.connections]);

  const connectedNodes = useMemo(() => {
    return getConnectedNodeIds(hoveredNodeId || selectedNodeId);
  }, [hoveredNodeId, selectedNodeId, getConnectedNodeIds]);

  // Get the position of the currently selected node for camera transitions
  const selectedNodePosition = useMemo(() => {
    if (!selectedNodeId) return null;
    const selectedNode = neuralData.nodes.find(node => node.id === selectedNodeId);
    return selectedNode ? selectedNode.position : null;
  }, [selectedNodeId, neuralData.nodes]);

  // Get the currently selected node data for the sidebar
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return neuralData.nodes.find(node => node.id === selectedNodeId) || null;
  }, [selectedNodeId, neuralData.nodes]);

  const handleNodeHover = (nodeId: string | null) => {
    if (!cameraTransitioning) {
      setHoveredNodeId(nodeId);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    const newSelectedId = selectedNodeId === nodeId ? null : nodeId;
    setSelectedNodeId(newSelectedId);
    setSidebarOpen(newSelectedId !== null);
    setCameraTransitioning(true);

    console.log(`Selected node: ${nodeId}`);
  };

  const handleCameraTransitionComplete = () => {
    setCameraTransitioning(false);
  };

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedNodeId(null);
    setCameraTransitioning(true);
  }, []);

  // Handle keyboard events for sidebar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        handleSidebarClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, handleSidebarClose]);

  // If device doesn't support 3D well, use 2D fallback
  if (!use3D) {
    return (
      <NeuralGrid2D
        className={className}
        projects={projects}
        blogs={blogs}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: deviceCapabilities.isMobile ? 75 : 60 }}
        style={{ background: 'transparent' }}
        dpr={deviceCapabilities.isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: !deviceCapabilities.isMobile,
          alpha: true,
          powerPreference: deviceCapabilities.isMobile ? 'low-power' : 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          {/* Scene Setup - lighting and environment */}
          <SceneSetup />

          {/* Camera Controls with smooth transitions */}
          <CameraController
            selectedNodePosition={selectedNodePosition}
            onTransitionComplete={handleCameraTransitionComplete}
          />

          {/* Connection Network - reduced on mobile/tablet */}
          {!useReducedEffects && (
            <ConnectionNetwork
              connections={neuralData.connections}
              nodePositions={nodePositions}
              highlightedNodeId={hoveredNodeId || selectedNodeId}
            />
          )}

          {/* Render nodes with enhanced interactions */}
          {neuralData.nodes.map((node) => (
            <Node3D
              key={node.id}
              position={node.position}
              type={node.type}
              title={node.title}
              nodeId={node.id}
              isSelected={selectedNodeId === node.id}
              isConnected={connectedNodes.has(node.id)}
              onHover={handleNodeHover}
              onClick={handleNodeClick}
            />
          ))}

          {/* Neural network boundary visualization */}
          <mesh>
            <boxGeometry args={[
              neuralData.bounds.x[1] - neuralData.bounds.x[0],
              neuralData.bounds.y[1] - neuralData.bounds.y[0],
              neuralData.bounds.z[1] - neuralData.bounds.z[0]
            ]} />
            <meshBasicMaterial
              color="#1e293b"
              transparent
              opacity={0.02}
              wireframe
            />
          </mesh>
        </Suspense>
      </Canvas>

      {/* Node name display overlay - responsive positioning */}
      {(hoveredNodeId || selectedNodeId) && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-3 shadow-lg">
          {(() => {
            const activeNodeId = hoveredNodeId || selectedNodeId;
            const activeNode = neuralData.nodes.find(n => n.id === activeNodeId);
            return activeNode ? (
              <div>
                <div className="text-white text-base md:text-lg font-medium mb-1">
                  {activeNode.title}
                </div>
                <div className="text-blue-300 text-sm capitalize">
                  {activeNode.type}
                </div>
                {selectedNodeId && (
                  <div className="text-green-400 text-xs mt-1">
                    ● Selected - Camera focused
                  </div>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Touch instructions for mobile */}
      {deviceCapabilities.supportsTouch && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto text-center md:text-left">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80">
            Touch and drag to navigate • Tap nodes to explore
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 text-xs text-gray-400 bg-black/20 p-2 rounded">
          <div>Nodes: {neuralData.nodes.length}</div>
          <div>Connections: {neuralData.connections.length}</div>
          <div>Hovered: {hoveredNodeId || 'none'}</div>
          <div>Selected: {selectedNodeId || 'none'}</div>
          <div>Camera: {cameraTransitioning ? 'transitioning' : 'idle'}</div>
          <div>Sidebar: {sidebarOpen ? 'open' : 'closed'}</div>
          <div>Interactive: ✓ Hover, Click, Camera, Sidebar</div>
        </div>
      )}

      {/* Sidebar Panel */}
      <Sidebar
        selectedNode={selectedNode}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
    </div>
  );
}