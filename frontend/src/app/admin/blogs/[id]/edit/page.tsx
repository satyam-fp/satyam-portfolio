'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminBlog, updateBlog, AdminApiError } from '@/lib/adminApi';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    author: '',
    tags: '',
    image_url: '',
    published: false,
    published_at: '',
    position_x: 0,
    position_y: 0,
    position_z: 0,
  });

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await getAdminBlog(blogId);
        
        // Format published_at for datetime-local input
        let publishedAtValue = '';
        if (blog.published_at) {
          const date = new Date(blog.published_at);
          publishedAtValue = date.toISOString().slice(0, 16);
        }
        
        setFormData({
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          summary: blog.summary || '',
          author: blog.author || '',
          tags: blog.tags ? blog.tags.join(', ') : '',
          image_url: blog.image_url || '',
          published: blog.published,
          published_at: publishedAtValue,
          position_x: blog.position_x,
          position_y: blog.position_y,
          position_z: blog.position_z,
        });
      } catch (err) {
        if (err instanceof AdminApiError) {
          setError(err.message);
        } else {
          setError('Failed to load blog post');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [blogId]);

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
      // Parse tags from comma-separated string to array
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        summary: formData.summary || undefined,
        author: formData.author || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        image_url: formData.image_url || undefined,
        published: formData.published,
        published_at: formData.published_at || undefined,
        position_x: parseFloat(formData.position_x.toString()),
        position_y: parseFloat(formData.position_y.toString()),
        position_z: parseFloat(formData.position_z.toString()),
      };

      await updateBlog(blogId, blogData);
      router.push('/admin/blogs');
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
          <div className="text-gray-600">Loading blog post...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <p className="text-gray-600 mt-1">Update blog post details</p>
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
            placeholder="blog-post-slug"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            URL-friendly identifier (e.g., my-first-blog-post)
          </p>
          {fieldErrors.slug && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.slug[0]}</p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={2}
            placeholder="Brief summary of the blog post..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.summary && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.summary[0]}</p>
          )}
        </div>

        {/* Content (Markdown) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content (Markdown) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            placeholder="Blog post content in markdown format..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          {fieldErrors.content && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.content[0]}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.author && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.author[0]}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="machine-learning, python, tutorial"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            Comma-separated list of tags
          </p>
          {fieldErrors.tags && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.tags[0]}</p>
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

        {/* Published At */}
        <div>
          <label htmlFor="published_at" className="block text-sm font-medium mb-1">
            Published Date
          </label>
          <input
            type="datetime-local"
            id="published_at"
            name="published_at"
            value={formData.published_at}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            Leave empty to use current date/time when published
          </p>
          {fieldErrors.published_at && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.published_at[0]}</p>
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

        {/* Published */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 text-sm font-medium">
            Published (visible on public site)
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
            onClick={() => router.push('/admin/blogs')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
