/**
 * Neural Network Positioning Algorithm
 * Creates intelligent 3D positioning for nodes based on their relationships and types
 */

import { Node3DData, Connection3D, NeuralNetworkData } from '@/types/3d';

export interface PositioningConfig {
  bounds: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  minDistance: number;
  clusterSeparation: number;
  connectionStrength: number;
}

const DEFAULT_CONFIG: PositioningConfig = {
  bounds: {
    x: [-12, 12],
    y: [-8, 8],
    z: [-10, 10]
  },
  minDistance: 2.5,
  clusterSeparation: 6,
  connectionStrength: 0.7
};

interface ProjectData {
  id: number | string;
  title: string;
  description?: string;
  tech_stack?: string[];
  techStack?: string[];
}

interface BlogData {
  id: number | string;
  title: string;
  summary?: string;
  content?: string;
}

/**
 * Generate 3D positions using a neural network-inspired layout
 */
export function generateNeuralPositions(
  projects: ProjectData[],
  blogs: BlogData[],
  config: PositioningConfig = DEFAULT_CONFIG
): NeuralNetworkData {
  const nodes: Node3DData[] = [];
  const connections: Connection3D[] = [];

  // Create project nodes with clustered positioning
  const projectCluster = generateClusterPositions(
    projects.length,
    [0, 2, 0], // Center position for projects
    config.clusterSeparation,
    config.bounds
  );

  projects.forEach((project, index) => {
    nodes.push({
      id: `project-${project.id || index}`,
      position: projectCluster[index],
      type: 'project',
      title: project.title,
      data: project
    });
  });

  // Create blog nodes with different cluster positioning
  const blogCluster = generateClusterPositions(
    blogs.length,
    [-3, -2, 3], // Different center for blogs
    config.clusterSeparation * 0.8,
    config.bounds
  );

  blogs.forEach((blog, index) => {
    nodes.push({
      id: `blog-${blog.id || index}`,
      position: blogCluster[index],
      type: 'blog',
      title: blog.title,
      data: blog
    });
  });

  // Generate connections based on content similarity and relationships
  connections.push(...generateConnections(nodes));

  // Apply force-directed positioning to optimize layout
  const optimizedNodes = applyForceDirectedLayout(nodes, connections, config);

  return {
    nodes: optimizedNodes,
    connections,
    bounds: config.bounds
  };
}

/**
 * Generate cluster positions using golden spiral distribution
 */
function generateClusterPositions(
  count: number,
  center: [number, number, number],
  radius: number,
  bounds: PositioningConfig['bounds']
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < count; i++) {
    // Golden spiral distribution on sphere
    const y = 1 - (i / (count - 1)) * 2; // y from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Scale and translate to cluster center
    const scaledRadius = radius * (0.7 + Math.random() * 0.6); // Add some randomness
    const position: [number, number, number] = [
      center[0] + x * scaledRadius,
      center[1] + y * scaledRadius * 0.8, // Flatten Y slightly
      center[2] + z * scaledRadius
    ];

    // Ensure within bounds
    position[0] = Math.max(bounds.x[0], Math.min(bounds.x[1], position[0]));
    position[1] = Math.max(bounds.y[0], Math.min(bounds.y[1], position[1]));
    position[2] = Math.max(bounds.z[0], Math.min(bounds.z[1], position[2]));

    positions.push(position);
  }

  return positions;
}

/**
 * Generate connections between related nodes
 */
function generateConnections(
  nodes: Node3DData[]
): Connection3D[] {
  const connections: Connection3D[] = [];

  // Connect projects to related blogs based on tech stack similarity
  nodes.filter(n => n.type === 'project').forEach(projectNode => {
    const project = projectNode.data as ProjectData;

    nodes.filter(n => n.type === 'blog').forEach(blogNode => {
      const blog = blogNode.data as BlogData;
      
      // Simple similarity based on title/content keywords
      const similarity = calculateContentSimilarity(project, blog);
      
      if (similarity > 0.3) { // Threshold for connection
        connections.push({
          from: projectNode.id,
          to: blogNode.id,
          strength: similarity
        });
      }
    });
  });

  // Connect related projects (similar tech stacks)
  const projectNodes = nodes.filter(n => n.type === 'project');
  for (let i = 0; i < projectNodes.length; i++) {
    for (let j = i + 1; j < projectNodes.length; j++) {
      const project1 = projectNodes[i].data as ProjectData;
      const project2 = projectNodes[j].data as ProjectData;
      
      const similarity = calculateTechStackSimilarity(
        project1.tech_stack || project1.techStack || [],
        project2.tech_stack || project2.techStack || []
      );
      
      if (similarity > 0.4) {
        connections.push({
          from: projectNodes[i].id,
          to: projectNodes[j].id,
          strength: similarity * 0.8 // Slightly weaker than project-blog connections
        });
      }
    }
  }

  return connections;
}

/**
 * Calculate similarity between project and blog content
 */
function calculateContentSimilarity(project: ProjectData, blog: BlogData): number {
  const projectKeywords = extractKeywords(project.title + ' ' + project.description);
  const blogKeywords = extractKeywords(blog.title + ' ' + (blog.summary || ''));
  
  const intersection = projectKeywords.filter(word => blogKeywords.includes(word));
  const union = [...new Set([...projectKeywords, ...blogKeywords])];
  
  return intersection.length / Math.max(union.length, 1);
}

/**
 * Calculate tech stack similarity between projects
 */
function calculateTechStackSimilarity(techStack1: string[], techStack2: string[]): number {
  if (!techStack1.length || !techStack2.length) return 0;
  
  const set1 = new Set(techStack1.map(tech => tech.toLowerCase()));
  const set2 = new Set(techStack2.map(tech => tech.toLowerCase()));
  
  const intersection = [...set1].filter(tech => set2.has(tech));
  const union = [...new Set([...set1, ...set2])];
  
  return intersection.length / union.length;
}

/**
 * Extract keywords from text for similarity calculation
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Apply force-directed layout to optimize node positions
 */
function applyForceDirectedLayout(
  nodes: Node3DData[],
  connections: Connection3D[],
  config: PositioningConfig,
  iterations: number = 50
): Node3DData[] {
  const optimizedNodes = nodes.map(node => ({ ...node }));
  const forces = new Map<string, [number, number, number]>();

  for (let iter = 0; iter < iterations; iter++) {
    // Reset forces
    optimizedNodes.forEach(node => {
      forces.set(node.id, [0, 0, 0]);
    });

    // Repulsion forces (nodes push away from each other)
    for (let i = 0; i < optimizedNodes.length; i++) {
      for (let j = i + 1; j < optimizedNodes.length; j++) {
        const node1 = optimizedNodes[i];
        const node2 = optimizedNodes[j];
        
        const dx = node1.position[0] - node2.position[0];
        const dy = node1.position[1] - node2.position[1];
        const dz = node1.position[2] - node2.position[2];
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < config.minDistance && distance > 0) {
          const repulsionForce = (config.minDistance - distance) / distance * 0.1;
          
          const force1 = forces.get(node1.id)!;
          const force2 = forces.get(node2.id)!;
          
          force1[0] += dx * repulsionForce;
          force1[1] += dy * repulsionForce;
          force1[2] += dz * repulsionForce;
          
          force2[0] -= dx * repulsionForce;
          force2[1] -= dy * repulsionForce;
          force2[2] -= dz * repulsionForce;
        }
      }
    }

    // Attraction forces (connected nodes pull toward each other)
    connections.forEach(connection => {
      const node1 = optimizedNodes.find(n => n.id === connection.from);
      const node2 = optimizedNodes.find(n => n.id === connection.to);
      
      if (node1 && node2) {
        const dx = node2.position[0] - node1.position[0];
        const dy = node2.position[1] - node1.position[1];
        const dz = node2.position[2] - node1.position[2];
        
        const attractionForce = connection.strength * 0.05;
        
        const force1 = forces.get(node1.id)!;
        const force2 = forces.get(node2.id)!;
        
        force1[0] += dx * attractionForce;
        force1[1] += dy * attractionForce;
        force1[2] += dz * attractionForce;
        
        force2[0] -= dx * attractionForce;
        force2[1] -= dy * attractionForce;
        force2[2] -= dz * attractionForce;
      }
    });

    // Apply forces with damping
    const damping = 0.8;
    optimizedNodes.forEach(node => {
      const force = forces.get(node.id)!;
      
      node.position[0] += force[0] * damping;
      node.position[1] += force[1] * damping;
      node.position[2] += force[2] * damping;
      
      // Keep within bounds
      node.position[0] = Math.max(config.bounds.x[0], Math.min(config.bounds.x[1], node.position[0]));
      node.position[1] = Math.max(config.bounds.y[0], Math.min(config.bounds.y[1], node.position[1]));
      node.position[2] = Math.max(config.bounds.z[0], Math.min(config.bounds.z[1], node.position[2]));
    });
  }

  return optimizedNodes;
}