// API client utilities for Neural Space backend communication

import { Project, Blog, NeuralDataResponse } from '@/types/api';

export interface StaticPage {
  id: number;
  page_key: string;
  title: string;
  content: Record<string, any>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    );
  }
}

// Project API functions
export async function getProjects(): Promise<Project[]> {
  return fetchApi<Project[]>('/api/projects');
}

export async function getProject(slug: string): Promise<Project> {
  return fetchApi<Project>(`/api/projects/${slug}`);
}

// Blog API functions
export async function getBlogs(): Promise<Blog[]> {
  return fetchApi<Blog[]>('/api/blogs');
}

export async function getBlog(slug: string): Promise<Blog> {
  return fetchApi<Blog>(`/api/blogs/${slug}`);
}

// Neural network data for 3D scene
export async function getNeuralData(): Promise<NeuralDataResponse> {
  return fetchApi<NeuralDataResponse>('/api/neural-data');
}

// Static page API functions
export async function getPage(key: string): Promise<StaticPage> {
  return fetchApi<StaticPage>(`/api/pages/${key}`);
}

// Utility function to transform API data to 3D nodes
export function transformToNodes(projects: Project[], blogs: Blog[]) {
  const nodes = [
    ...projects.map(project => ({
      id: `project-${project.id}`,
      position: [project.position_x, project.position_y, project.position_z] as [number, number, number],
      type: 'project' as const,
      data: project,
    })),
    ...blogs.map(blog => ({
      id: `blog-${blog.id}`,
      position: [blog.position_x, blog.position_y, blog.position_z] as [number, number, number],
      type: 'blog' as const,
      data: blog,
    })),
  ];

  return nodes;
}

export { ApiError };