import { render, screen } from '@testing-library/react';
import BlogCard from '../BlogCard';
import { Blog } from '@/types/api';

const mockBlog: Blog = {
  id: 1,
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  content: '# Test Content\n\nThis is test content.',
  summary: 'This is a test blog post summary.',
  position_x: 0,
  position_y: 0,
  position_z: 0,
  created_at: '2024-03-01T00:00:00Z',
};

describe('BlogCard', () => {
  it('renders blog card with default variant', () => {
    render(<BlogCard blog={mockBlog} />);
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post summary.')).toBeInTheDocument();
    expect(screen.getByText('Read more →')).toBeInTheDocument();
  });

  it('renders blog card with compact variant', () => {
    render(<BlogCard blog={mockBlog} variant="compact" />);
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post summary.')).toBeInTheDocument();
  });

  it('renders blog card with timeline variant', () => {
    render(<BlogCard blog={mockBlog} variant="timeline" />);
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post summary.')).toBeInTheDocument();
  });

  it('renders without summary when not provided', () => {
    const blogWithoutSummary = { ...mockBlog, summary: undefined };
    
    render(<BlogCard blog={blogWithoutSummary} />);
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.queryByText('This is a test blog post summary.')).not.toBeInTheDocument();
  });

  it('has correct link to blog detail page', () => {
    render(<BlogCard blog={mockBlog} />);
    
    const link = screen.getByRole('link', { name: 'Test Blog Post' });
    expect(link).toHaveAttribute('href', '/blog/test-blog-post');
  });

  it('displays formatted date', () => {
    render(<BlogCard blog={mockBlog} />);
    
    expect(screen.getByText('March 1, 2024')).toBeInTheDocument();
  });
});