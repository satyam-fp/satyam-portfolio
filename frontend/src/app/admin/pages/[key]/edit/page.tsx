'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getStaticPage, updateStaticPage, AdminApiError } from '@/lib/adminApi';

export default function EditPagePage() {
  const params = useParams();
  const pageKey = params.key as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const page = await getStaticPage(pageKey);
      setTitle(page.title);
      setContent(JSON.stringify(page.content, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  function validateJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate JSON before submitting
    if (!validateJson(content)) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const contentObj = JSON.parse(content);
      
      await updateStaticPage(pageKey, {
        title,
        content: contentObj,
      });

      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update page');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleContentChange(value: string) {
    setContent(value);
    // Clear JSON error when user starts typing
    if (jsonError) {
      setJsonError(null);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading page</p>
          <p className="text-sm">{error}</p>
        </div>
        <Link
          href="/admin/pages"
          className="mt-4 inline-block text-blue-600 hover:text-blue-900"
        >
          ← Back to Pages
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/pages"
          className="text-blue-600 hover:text-blue-900 text-sm mb-2 inline-block"
        >
          ← Back to Pages
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page
        </h1>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Page updated successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error updating page</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content (JSON)
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Edit the page content as JSON. Make sure the JSON is valid before saving.
          </p>
          <textarea
            id="content"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 font-mono text-sm ${
              jsonError
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={20}
            required
          />
          {jsonError && (
            <p className="mt-2 text-sm text-red-600">
              Invalid JSON: {jsonError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => validateJson(content)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Validate JSON
          </button>
          
          <div className="flex gap-3">
            <Link
              href="/admin/pages"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !!jsonError}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
