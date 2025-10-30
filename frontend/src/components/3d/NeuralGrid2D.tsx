'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateNeuralPositions } from '@/lib/neuralPositioning';
import { NeuralNetworkData, Node3DData } from '@/types/3d';
import { Sidebar } from './Sidebar';

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

interface NeuralGrid2DProps {
  className?: string;
  projects?: ProjectData[];
  blogs?: BlogData[];
}

// 2D Node Component
interface Node2DProps {
  node: Node3DData;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
  index: number;
}

function Node2D({ node, isSelected, onClick, index }: Node2DProps) {
  const handleClick = () => {
    onClick(node.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : 'border-border hover:border-primary/50 bg-card hover:bg-card/80'
        }
        ${node.type === 'project' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'}
        touch-manipulation
      `}
    >
      {/* Node Type Indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          node.type === 'project' ? 'bg-blue-500' : 'bg-green-500'
        }`} />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {node.type}
        </span>
      </div>

      {/* Node Title */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
        {node.title}
      </h3>

      {/* Node Description/Summary */}
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {node.type === 'project' 
          ? (node.data as ProjectData)?.description || 'Project description'
          : (node.data as BlogData)?.summary || 'Blog post summary'
        }
      </p>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

export function NeuralGrid2D({ className, projects = [], blogs = [] }: NeuralGrid2DProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Generate neural network data (we'll use this for consistent node ordering)
  const neuralData: NeuralNetworkData = useMemo(() => {
    return generateNeuralPositions(projects, blogs);
  }, [projects, blogs]);

  // Get the currently selected node data for the sidebar
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return neuralData.nodes.find(node => node.id === selectedNodeId) || null;
  }, [selectedNodeId, neuralData.nodes]);

  const handleNodeClick = (nodeId: string) => {
    const newSelectedId = selectedNodeId === nodeId ? null : nodeId;
    setSelectedNodeId(newSelectedId);
    setSidebarOpen(newSelectedId !== null);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedNodeId(null);
  };

  // Handle keyboard events for sidebar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        handleSidebarClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2"
        >
          Neural Network
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Tap any node to explore projects and blog posts
        </motion.p>
      </div>

      {/* 2D Grid Layout */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {neuralData.nodes.map((node, index) => (
            <Node2D
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={handleNodeClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Stats Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center px-4 py-6 border-t border-border bg-card/50"
      >
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-muted-foreground">
              {neuralData.nodes.filter(n => n.type === 'project').length} Projects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-muted-foreground">
              {neuralData.nodes.filter(n => n.type === 'blog').length} Blog Posts
            </span>
          </div>
        </div>
      </motion.div>

      {/* Selected Node Info Overlay */}
      <AnimatePresence>
        {selectedNodeId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-lg">
              {(() => {
                const activeNode = neuralData.nodes.find(n => n.id === selectedNodeId);
                return activeNode ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {activeNode.title}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {activeNode.type} • Selected
                      </div>
                    </div>
                    <button
                      onClick={handleSidebarClose}
                      className="p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <Sidebar
        selectedNode={selectedNode}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
    </div>
  );
}