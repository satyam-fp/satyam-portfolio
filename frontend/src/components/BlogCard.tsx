import Link from 'next/link';
import { Blog } from '@/types/api';
import BlogMetadata from './BlogMetadata';
import { Card, Text, Heading } from '@/components/ui';

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'compact' | 'timeline';
}

export default function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  if (variant === 'timeline') {
    return (
      <article className="group relative pl-8 pb-8 border-l-2 border-border last:border-l-0">
        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
        
        <div className="mb-3">
          <BlogMetadata blog={blog} />
        </div>
        
        <Heading level={3} className="mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </Heading>
        
        {blog.summary && (
          <Text size="sm" variant="muted" leading="relaxed" className="mb-3 line-clamp-2">
            {blog.summary}
          </Text>
        )}
        
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors"
        >
          Read more →
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group border-b border-border pb-4 last:border-b-0">
        <div className="mb-2">
          <BlogMetadata blog={blog} />
        </div>
        
        <Heading level={3} className="mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </Heading>
        
        {blog.summary && (
          <Text size="sm" variant="muted" leading="relaxed" className="mb-2 line-clamp-2">
            {blog.summary}
          </Text>
        )}
        
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center text-xs font-medium text-primary hover:underline transition-colors"
        >
          Read more →
        </Link>
      </article>
    );
  }

  return (
    <Card variant="blog" className="group relative overflow-hidden">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(var(--primary), 0.1) 50%, transparent 60%)`,
          backgroundSize: '20px 20px',
          animation: 'slide 3s linear infinite'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <BlogMetadata blog={blog} />
          <div className="flex items-center gap-1">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-green-400/40 rounded-full animate-pulse group-hover:bg-green-400 group-hover:scale-125 transition-all duration-300"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
        
        <Heading level={2} className="mb-4 group-hover:text-primary transition-all duration-300 leading-tight group-hover:translate-x-1">
          <Link href={`/blog/${blog.slug}`} className="relative">
            {blog.title}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500"></span>
          </Link>
        </Heading>
        
        {blog.summary && (
          <Text size="responsive" variant="muted" leading="relaxed" className="mb-6 group-hover:text-muted-foreground/80 transition-colors">
            {blog.summary}
          </Text>
        )}
        
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 group/link"
          >
            <span className="relative">
              Read Article
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300"></span>
            </span>
            <svg className="w-4 h-4 ml-2 transition-all duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          {/* Reading Time Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>5 min read</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </Card>
  );
}