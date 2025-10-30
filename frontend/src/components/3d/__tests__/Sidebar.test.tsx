import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../Sidebar';
import { Node3DData } from '@/types/3d';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: (props: React.ComponentProps<'div'>) => React.createElement('div', props),
  },
  AnimatePresence: (props: { children: React.ReactNode }) => React.createElement('div', {}, props.children),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => React.createElement('div', { 'data-testid': 'close-icon' }, 'X'),
  ExternalLink: () => React.createElement('div', { 'data-testid': 'external-link-icon' }, '↗'),
  Github: () => React.createElement('div', { 'data-testid': 'github-icon' }, 'GitHub'),
  Calendar: () => React.createElement('div', { 'data-testid': 'calendar-icon' }, '📅'),
  Tag: () => React.createElement('div', { 'data-testid': 'tag-icon' }, '🏷️'),
}));

const mockProjectNode: Node3DData = {
  id: 'project-1',
  position: [0, 0, 0],
  type: 'project',
  title: 'Test Project',
  data: {
    id: 1,
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project for sidebar functionality',
    tech_stack: ['React', 'TypeScript', 'Three.js'],
    github_url: 'https://github.com/test/project',
    live_demo: 'https://test-project.vercel.app',
    created_at: '2024-01-15T00:00:00Z'
  }
};

const mockBlogNode: Node3DData = {
  id: 'blog-1',
  position: [0, 0, 0],
  type: 'blog',
  title: 'Test Blog Post',
  data: {
    id: 1,
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is a test blog post content that should be displayed in the sidebar when the blog node is selected.',
    summary: 'A test blog post summary',
    created_at: '2024-01-20T00:00:00Z'
  }
};

describe('Sidebar Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when no node is selected', () => {
    render(<Sidebar selectedNode={null} isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Node Details')).not.toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<Sidebar selectedNode={mockProjectNode} isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Node Details')).not.toBeInTheDocument();
  });

  it('should render project content when project node is selected', () => {
    render(<Sidebar selectedNode={mockProjectNode} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Node Details')).toBeInTheDocument();
    expect(screen.getByText('PROJECT')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project for sidebar functionality')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Three.js')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
    expect(screen.getByText('Live Demo')).toBeInTheDocument();
  });

  it('should render blog content when blog node is selected', () => {
    render(<Sidebar selectedNode={mockBlogNode} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Node Details')).toBeInTheDocument();
    expect(screen.getByText('BLOG POST')).toBeInTheDocument();
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('A test blog post summary')).toBeInTheDocument();
    expect(screen.getByText('Content Preview')).toBeInTheDocument();
    expect(screen.getByText(/This is a test blog post content/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Sidebar selectedNode={mockProjectNode} isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<Sidebar selectedNode={mockProjectNode} isOpen={true} onClose={mockOnClose} />);
    
    // The backdrop should be present for mobile (lg:hidden class)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/20');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should display correct visual indicators for project type', () => {
    render(<Sidebar selectedNode={mockProjectNode} isOpen={true} onClose={mockOnClose} />);
    
    const projectIndicator = document.querySelector('.bg-blue-400');
    expect(projectIndicator).toBeInTheDocument();
  });

  it('should display correct visual indicators for blog type', () => {
    render(<Sidebar selectedNode={mockBlogNode} isOpen={true} onClose={mockOnClose} />);
    
    const blogIndicator = document.querySelector('.bg-green-400');
    expect(blogIndicator).toBeInTheDocument();
  });

  it('should handle project without optional fields', () => {
    const minimalProjectNode: Node3DData = {
      id: 'project-minimal',
      position: [0, 0, 0],
      type: 'project',
      title: 'Minimal Project',
      data: {
        id: 2,
        title: 'Minimal Project',
        slug: 'minimal-project',
        description: 'A minimal project',
        tech_stack: [],
        created_at: '2024-01-15T00:00:00Z'
      }
    };

    render(<Sidebar selectedNode={minimalProjectNode} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Minimal Project')).toBeInTheDocument();
    expect(screen.getByText('A minimal project')).toBeInTheDocument();
    // Should not show GitHub or Live Demo links
    expect(screen.queryByText('View on GitHub')).not.toBeInTheDocument();
    expect(screen.queryByText('Live Demo')).not.toBeInTheDocument();
  });

  it('should handle blog without summary', () => {
    const minimalBlogNode: Node3DData = {
      id: 'blog-minimal',
      position: [0, 0, 0],
      type: 'blog',
      title: 'Minimal Blog',
      data: {
        id: 2,
        title: 'Minimal Blog',
        slug: 'minimal-blog',
        content: 'Just content, no summary',
        created_at: '2024-01-20T00:00:00Z'
      }
    };

    render(<Sidebar selectedNode={minimalBlogNode} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Minimal Blog')).toBeInTheDocument();
    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
    expect(screen.getByText('Content Preview')).toBeInTheDocument();
  });

  it('should truncate long blog content and show read more', () => {
    const longContent = 'A'.repeat(400); // Content longer than 300 characters
    const longBlogNode: Node3DData = {
      id: 'blog-long',
      position: [0, 0, 0],
      type: 'blog',
      title: 'Long Blog',
      data: {
        id: 3,
        title: 'Long Blog',
        slug: 'long-blog',
        content: longContent,
        created_at: '2024-01-20T00:00:00Z'
      }
    };

    render(<Sidebar selectedNode={longBlogNode} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/A{300}\.\.\./, { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Read full article →')).toBeInTheDocument();
  });
});