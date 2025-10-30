export interface Node3DData {
  id: string;
  position: [number, number, number];
  type: 'project' | 'blog';
  title: string;
  data?: {
    id: number | string;
    title: string;
    description?: string;
    summary?: string;
    content?: string;
    tech_stack?: string[];
    techStack?: string[];
  };
}

export interface Connection3D {
  from: string;
  to: string;
  strength: number; // 0-1, affects visual weight
}

export interface NeuralNetworkData {
  nodes: Node3DData[];
  connections: Connection3D[];
  bounds: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
}

export interface SceneBounds {
  x: [number, number];
  y: [number, number];
  z: [number, number];
}