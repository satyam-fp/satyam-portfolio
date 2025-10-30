import { render, screen } from '@testing-library/react';
import MarkdownRenderer from '../MarkdownRenderer';

// Mock highlight.js CSS import
jest.mock('highlight.js/styles/github-dark.css', () => ({}));

describe('MarkdownRenderer', () => {
  it('renders basic markdown content', () => {
    const content = '# Hello World\n\nThis is a **bold** text.';
    
    render(<MarkdownRenderer content={content} />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('renders code blocks with syntax highlighting', () => {
    const content = '```python\nprint("Hello, World!")\n```';
    
    render(<MarkdownRenderer content={content} />);
    
    const codeElement = screen.getByText('print("Hello, World!")');
    expect(codeElement).toBeInTheDocument();
  });

  it('renders inline code', () => {
    const content = 'Use the `console.log()` function.';
    
    render(<MarkdownRenderer content={content} />);
    
    expect(screen.getByText('console.log()')).toBeInTheDocument();
  });

  it('renders lists correctly', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    
    render(<MarkdownRenderer content={content} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders links with proper attributes', () => {
    const content = '[External Link](https://example.com) and [Internal Link](/internal)';
    
    render(<MarkdownRenderer content={content} />);
    
    const externalLink = screen.getByText('External Link');
    const internalLink = screen.getByText('Internal Link');
    
    expect(externalLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(externalLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(internalLink.closest('a')).not.toHaveAttribute('target');
  });

  it('applies custom className', () => {
    const content = '# Test';
    const customClass = 'custom-class';
    
    const { container } = render(
      <MarkdownRenderer content={content} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });
});