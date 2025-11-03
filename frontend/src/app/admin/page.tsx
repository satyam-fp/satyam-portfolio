'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardStats, type DashboardStats } from '@/lib/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/admin/projects/new')}
            variant="default"
          >
            Create New Project
          </Button>
          <Button
            onClick={() => router.push('/admin/blogs/new')}
            variant="default"
          >
            Create New Blog
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="neural">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_projects}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.featured_projects} featured
              </p>
            </CardContent>
          </Card>

          <Card variant="neural">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Blogs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_blogs}</div>
              <p className="text-xs text-muted-foreground mt-2">
                All blog posts
              </p>
            </CardContent>
          </Card>

          <Card variant="neural">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published Blogs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.published_blogs}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Live on site
              </p>
            </CardContent>
          </Card>

          <Card variant="neural">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Draft Blogs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {stats.draft_blogs}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Not published yet
              </p>
            </CardContent>
          </Card>

          <Card variant="neural">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.featured_projects}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Highlighted projects
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            variant="interactive"
            onClick={() => router.push('/admin/projects')}
          >
            <CardHeader>
              <CardTitle className="text-base">Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View, edit, and delete projects
              </p>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            onClick={() => router.push('/admin/blogs')}
          >
            <CardHeader>
              <CardTitle className="text-base">Manage Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View, edit, and delete blog posts
              </p>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            onClick={() => router.push('/admin/pages')}
          >
            <CardHeader>
              <CardTitle className="text-base">Manage Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Edit static page content
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats ? `${stats.total_projects + stats.total_blogs} total items` : 'Loading...'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
