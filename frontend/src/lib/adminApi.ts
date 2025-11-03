// Admin API client for authenticated operations

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

// Generic fetch wrapper for admin endpoints
async function fetchAdmin<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Extract field errors if present
      const fieldErrors = data.field_errors || undefined;
      const message = data.detail || `Request failed: ${response.statusText}`;
      
      throw new AdminApiError(
        message,
        response.status,
        response.statusText,
        fieldErrors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AdminApiError) {
      throw error;
    }
    throw new AdminApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    );
  }
}

// ============================================================================
// Authentication API
// ============================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
}

export async function adminLogin(
  username: string,
  password: string
): Promise<LoginResponse> {
  return fetchAdmin<LoginResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout(): Promise<void> {
  await fetchAdmin<void>('/api/admin/logout', {
    method: 'POST',
  });
}

export async function verifyAdminSession(): Promise<{ valid: boolean; user?: any }> {
  return fetchAdmin<{ valid: boolean; user?: any }>('/api/admin/verify');
}

// ============================================================================
// Projects API
// ============================================================================

export interface ProjectCreateData {
  title: string;
  slug: string;
  description: string;
  content?: string;
  tech_stack: string[];
  github_url?: string;
  live_demo?: string;
  image_url?: string;
  featured?: boolean;
  position_x: number;
  position_y: number;
  position_z: number;
}

export interface ProjectUpdateData {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  tech_stack?: string[];
  github_url?: string;
  live_demo?: string;
  image_url?: string;
  featured?: boolean;
  position_x?: number;
  position_y?: number;
  position_z?: number;
}

export interface ProjectAdmin {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  tech_stack: string[];
  github_url?: string;
  live_demo?: string;
  image_url?: string;
  featured: boolean;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: string;
}

export async function getAdminProjects(): Promise<ProjectAdmin[]> {
  return fetchAdmin<ProjectAdmin[]>('/api/admin/projects');
}

export async function getAdminProject(id: number): Promise<ProjectAdmin> {
  return fetchAdmin<ProjectAdmin>(`/api/admin/projects/${id}`);
}

export async function createProject(data: ProjectCreateData): Promise<ProjectAdmin> {
  return fetchAdmin<ProjectAdmin>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: number,
  data: ProjectUpdateData
): Promise<ProjectAdmin> {
  return fetchAdmin<ProjectAdmin>(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await fetchAdmin<void>(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Blogs API
// ============================================================================

export interface BlogCreateData {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  published?: boolean;
  author?: string;
  tags?: string[];
  image_url?: string;
  published_at?: string;
  position_x: number;
  position_y: number;
  position_z: number;
}

export interface BlogUpdateData {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  published?: boolean;
  author?: string;
  tags?: string[];
  image_url?: string;
  published_at?: string;
  position_x?: number;
  position_y?: number;
  position_z?: number;
}

export interface BlogAdmin {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  published: boolean;
  author?: string;
  tags?: string[];
  image_url?: string;
  published_at?: string;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: string;
}

export async function getAdminBlogs(): Promise<BlogAdmin[]> {
  return fetchAdmin<BlogAdmin[]>('/api/admin/blogs');
}

export async function getAdminBlog(id: number): Promise<BlogAdmin> {
  return fetchAdmin<BlogAdmin>(`/api/admin/blogs/${id}`);
}

export async function createBlog(data: BlogCreateData): Promise<BlogAdmin> {
  return fetchAdmin<BlogAdmin>('/api/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBlog(
  id: number,
  data: BlogUpdateData
): Promise<BlogAdmin> {
  return fetchAdmin<BlogAdmin>(`/api/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBlog(id: number): Promise<void> {
  await fetchAdmin<void>(`/api/admin/blogs/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Static Pages API
// ============================================================================

export interface StaticPage {
  id: number;
  page_key: string;
  title: string;
  content: Record<string, any>;
  updated_at: string;
  created_at: string;
}

export interface StaticPageUpdateData {
  title: string;
  content: Record<string, any>;
}

export async function getStaticPages(): Promise<StaticPage[]> {
  return fetchAdmin<StaticPage[]>('/api/admin/pages');
}

export async function getStaticPage(key: string): Promise<StaticPage> {
  return fetchAdmin<StaticPage>(`/api/admin/pages/${key}`);
}

export async function updateStaticPage(
  key: string,
  data: StaticPageUpdateData
): Promise<StaticPage> {
  return fetchAdmin<StaticPage>(`/api/admin/pages/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ============================================================================
// Dashboard Stats API
// ============================================================================

export interface DashboardStats {
  total_projects: number;
  total_blogs: number;
  published_blogs: number;
  draft_blogs: number;
  featured_projects: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchAdmin<DashboardStats>('/api/admin/stats');
}

// Export error class for error handling
export { AdminApiError };
