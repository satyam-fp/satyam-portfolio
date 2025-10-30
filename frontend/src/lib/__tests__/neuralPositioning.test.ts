/**
 * Tests for neural positioning algorithm
 */

import { generateNeuralPositions } from '../neuralPositioning';

describe('Neural Positioning Algorithm', () => {
  const sampleProjects = [
    {
      id: 1,
      title: 'Neural Mesh Reconstruction',
      description: 'Deep learning pipeline for reconstructing 3D meshes',
      tech_stack: ['Python', 'PyTorch', 'Open3D']
    },
    {
      id: 2,
      title: 'Real-time Style Transfer',
      description: 'GPU-accelerated neural style transfer system',
      tech_stack: ['C++', 'CUDA', 'OpenGL']
    }
  ];

  const sampleBlogs = [
    {
      id: 1,
      title: 'Getting Started with NeRF',
      summary: 'A comprehensive guide to Neural Radiance Fields',
      content: 'Neural Radiance Fields have revolutionized...'
    }
  ];

  test('should generate correct number of nodes', () => {
    const result = generateNeuralPositions(sampleProjects, sampleBlogs);
    
    expect(result.nodes).toHaveLength(3); // 2 projects + 1 blog
    expect(result.nodes.filter(n => n.type === 'project')).toHaveLength(2);
    expect(result.nodes.filter(n => n.type === 'blog')).toHaveLength(1);
  });

  test('should generate nodes with valid positions', () => {
    const result = generateNeuralPositions(sampleProjects, sampleBlogs);
    
    result.nodes.forEach(node => {
      expect(node.position).toHaveLength(3);
      expect(typeof node.position[0]).toBe('number');
      expect(typeof node.position[1]).toBe('number');
      expect(typeof node.position[2]).toBe('number');
      
      // Check positions are within bounds
      expect(node.position[0]).toBeGreaterThanOrEqual(-12);
      expect(node.position[0]).toBeLessThanOrEqual(12);
      expect(node.position[1]).toBeGreaterThanOrEqual(-8);
      expect(node.position[1]).toBeLessThanOrEqual(8);
      expect(node.position[2]).toBeGreaterThanOrEqual(-10);
      expect(node.position[2]).toBeLessThanOrEqual(10);
    });
  });

  test('should generate connections between related nodes', () => {
    const result = generateNeuralPositions(sampleProjects, sampleBlogs);
    
    expect(result.connections).toBeDefined();
    expect(Array.isArray(result.connections)).toBe(true);
    
    result.connections.forEach(connection => {
      expect(connection.from).toBeDefined();
      expect(connection.to).toBeDefined();
      expect(connection.strength).toBeGreaterThanOrEqual(0);
      expect(connection.strength).toBeLessThanOrEqual(1);
    });
  });

  test('should include data in nodes', () => {
    const result = generateNeuralPositions(sampleProjects, sampleBlogs);
    
    result.nodes.forEach(node => {
      expect(node.data).toBeDefined();
      expect(node.title).toBeDefined();
      expect(node.id).toBeDefined();
      expect(['project', 'blog']).toContain(node.type);
    });
  });

  test('should handle empty input gracefully', () => {
    const result = generateNeuralPositions([], []);
    
    expect(result.nodes).toHaveLength(0);
    expect(result.connections).toHaveLength(0);
    expect(result.bounds).toBeDefined();
  });
});