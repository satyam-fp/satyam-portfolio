import { render, screen } from '@testing-library/react';
import BlogMetadata from '../BlogMetadata';
import { Blog } from '@/types/api';

const mockBlog: Blog = {
  id: 1,
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  content: 'This is a test blog post with some content that should take about 1 minute to read. '.repeat(50),
  summary: 'This is a test blog post summary.',
  position_x: 0,
  position_y: 0,
  position_z: 0,
  created_at: '2024-03-01T00:00:00Z',
};

describe('BlogMetadata', () => {
  it('renders default metadata', () => {
    render(<BlogMetadata blog={mockBlog} />);
    
    expect(screen.getByText('March 1, 2024')).toBeInTheDocument();
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  it('renders detailed metadata', () => {
    render(<BlogMetadata blog={mockBlog} variant="detailed" />);
    
    expect(screen.getByText('March 1, 2024')).toBeInTheDocument();
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    expect(screen.getByText('Summary available')).toBeInTheDocument();
  });

  it('calculates reading time correctly', () => {
    const shortBlog = { ...mockBlog, content: 'Short content.' };
    
    render(<BlogMetadata blog={shortBlog} />);
    
    expect(screen.getByText('1 min read')).toBeInTheDocument();
  });

  it('does not show summary indicator when no summary', () => {
    const blogWithoutSummary = { ...mockBlog, summary: undefined };
    
    render(<BlogMetadata blog={blogWithoutSummary} variant="detailed" />);
    
    expect(screen.queryByText('Summary available')).not.toBeInTheDocument();
  });
});