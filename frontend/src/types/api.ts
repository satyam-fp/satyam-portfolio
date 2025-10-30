// API data types for Neural Space portfolio

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_demo?: string;
  image_url?: string;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string; // Markdown content
  summary?: string;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: string;
}

export interface Node3D {
  id: string;
  position: [number, number, number];
  type: 'project' | 'blog';
  data: Project | Blog;
  connections?: string[];
}

export interface NeuralNetworkData {
  nodes: Node3D[];
  connections?: Connection[];
  bounds: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
}

export interface Connection {
  from: string;
  to: string;
  strength: number; // 0-1, affects visual weight
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface BlogsResponse {
  blogs: Blog[];
}

export interface NeuralDataResponse {
  projects: Project[];
  blogs: Blog[];
}