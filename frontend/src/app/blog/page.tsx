'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard';
import { getBlogs } from '@/lib/api';
import { Blog } from '@/types/api';
import { BlogCardSkeleton } from '@/components/ui';
import { staggerContainer, staggerItem, fadeInUp } from '@/components/PageTransition';

// Fallback mock data for development
const mockBlogs: Blog[] = [
  {
    id: 1,
    title: 'Getting Started with 3D Machine Learning',
    slug: 'getting-started-3d-ml',
    summary: 'An introduction to the fascinating world of 3D machine learning, covering point clouds, meshes, and voxels.',
    created_at: '2024-03-01',
    content: '',
    position_x: 0,
    position_y: 0,
    position_z: 0,
  },
  {
    id: 2,
    title: 'Real-time Neural Rendering Techniques',
    slug: 'realtime-neural-rendering',
    summary: 'Exploring modern techniques for real-time neural rendering and their applications in interactive 3D graphics.',
    created_at: '2024-02-15',
    content: '',
    position_x: 0,
    position_y: 0,
    position_z: 0,
  },
  {
    id: 3,
    title: 'Point Cloud Processing with Deep Learning',
    slug: 'point-cloud-deep-learning',
    summary: 'Deep dive into processing 3D point clouds using neural networks, from PointNet to modern architectures.',
    created_at: '2024-01-30',
    content: '',
    position_x: 0,
    position_y: 0,
    position_z: 0,
  },
];

function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        const blogsData = await getBlogs();
        setBlogs(blogsData || []);
      } catch (err) {
        console.warn('Failed to fetch blogs from API, using mock data:', err);
        setBlogs(mockBlogs);
        setError('Failed to load blogs from API, showing mock data');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} variants={staggerItem}>
            <BlogCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Blogs</h3>
        <p className="text-muted-foreground mb-4">Showing sample content instead.</p>
      </div>
    );
  }

  // Sort blogs by creation date (newest first)
  const sortedBlogs = blogs.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (sortedBlogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {sortedBlogs.map((blog) => (
        <motion.div key={blog.id} variants={staggerItem}>
          <BlogCard blog={blog} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function BlogPage() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
    >
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Technical insights and learning journey in AI and 3D development
            </p>
          </motion.div>

          <BlogList />
        </div>
      </div>
    </motion.div>
  );
}