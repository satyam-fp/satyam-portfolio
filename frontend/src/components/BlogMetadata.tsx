import { Blog } from '@/types/api';

interface BlogMetadataProps {
  blog: Blog;
  variant?: 'default' | 'detailed';
}

export default function BlogMetadata({ blog, variant = 'default' }: BlogMetadataProps) {
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil(blog.content.split(' ').length / 200); // Approximate reading time

  if (variant === 'detailed') {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-muted px-2 py-1 rounded">
            {formattedDate}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>📖</span>
          <span>{readingTime} min read</span>
        </div>
        
        {blog.summary && (
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>Summary available</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <time className="font-mono">
        {formattedDate}
      </time>
      
      <span>•</span>
      
      <span>{readingTime} min read</span>
    </div>
  );
}