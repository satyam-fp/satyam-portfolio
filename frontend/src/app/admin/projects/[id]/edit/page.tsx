'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminProject, updateProject, AdminApiError } from '@/lib/adminApi';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    tech_stack: '',
    github_url: '',
    live_demo: '',
    image_url: '',
    featured: false,
    position_x: 0,
    position_y: 0,
    position_z: 0,
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getAdminProject(projectId);
        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content || '',
          tech_stack: project.tech_stack.join(', '),
          github_url: project.github_url || '',
          live_demo: project.live_demo || '',
          image_url: project.image_url || '',
          featured: project.featured,
          position_x: project.position_x,
          position_y: project.position_y,
          position_z: project.position_z,
        });
      } catch (err) {
        if (err instanceof AdminApiError) {
          setError(err.message);
        } else {
          setError('Failed to load project');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      // Parse tech_stack from comma-separated string to array
      const techStackArray = formData.tech_stack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const projectData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content || undefined,
        tech_stack: techStackArray,
        github_url: formData.github_url || undefined,
        live_demo: formData.live_demo || undefined,
        image_url: formData.image_url || undefined,
        featured: formData.featured,
        position_x: parseFloat(formData.position_x.toString()),
        position_y: parseFloat(formData.position_y.toString()),
        position_z: parseFloat(formData.position_z.toString()),
      };

      await updateProject(projectId, projectData);
      router.push('/admin/projects');
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading project...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-gray-600 mt-1">Update project details</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.title && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.title[0]}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="project-slug"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            URL-friendly identifier (e.g., my-awesome-project)
          </p>
          {fieldErrors.slug && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.slug[0]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.description && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.description[0]}</p>
          )}
        </div>

        {/* Content (Markdown) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Detailed project content in markdown format..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          {fieldErrors.content && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.content[0]}</p>
          )}
        </div>

        {/* Tech Stack */}
        <div>
          <label htmlFor="tech_stack" className="block text-sm font-medium mb-1">
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="tech_stack"
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            required
            placeholder="React, TypeScript, Node.js"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            Comma-separated list of technologies
          </p>
          {fieldErrors.tech_stack && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.tech_stack[0]}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.github_url && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.github_url[0]}</p>
          )}
        </div>

        {/* Live Demo URL */}
        <div>
          <label htmlFor="live_demo" className="block text-sm font-medium mb-1">
            Live Demo URL
          </label>
          <input
            type="url"
            id="live_demo"
            name="live_demo"
            value={formData.live_demo}
            onChange={handleChange}
            placeholder="https://demo.example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.live_demo && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.live_demo[0]}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.image_url && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.image_url[0]}</p>
          )}
        </div>

        {/* 3D Position */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="position_x" className="block text-sm font-medium mb-1">
              Position X <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="position_x"
              name="position_x"
              value={formData.position_x}
              onChange={handleChange}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="position_y" className="block text-sm font-medium mb-1">
              Position Y <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="position_y"
              name="position_y"
              value={formData.position_y}
              onChange={handleChange}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="position_z" className="block text-sm font-medium mb-1">
              Position Z <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="position_z"
              name="position_z"
              value={formData.position_z}
              onChange={handleChange}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="featured" className="ml-2 text-sm font-medium">
            Featured Project
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
