import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

// Mock the 3D components since they require WebGL
jest.mock('@/components/3d', () => ({
  NeuronBackground: ({ className }: { className?: string }) => (
    <div className={className} data-testid="neuron-background">
      Mocked Neuron Background
    </div>
  ),
}));

describe('AboutPage', () => {
  it('renders the about page with all required sections', () => {
    render(<AboutPage />);
    
    // Check for main heading
    expect(screen.getByText('About Me')).toBeInTheDocument();
    
    // Check for profile description
    expect(screen.getByText(/Machine Learning Engineer specializing in AI for 3D applications/)).toBeInTheDocument();
    
    // Check for background section
    expect(screen.getByText('Background')).toBeInTheDocument();
    
    // Check for expertise section
    expect(screen.getByText('Expertise')).toBeInTheDocument();
    
    // Check for statistics
    expect(screen.getByText('3+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Research Papers')).toBeInTheDocument();
    
    // Check for contact section
    expect(screen.getByText("Let's Connect")).toBeInTheDocument();
    
    // Check for contact links
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders skill tags correctly', () => {
    render(<AboutPage />);
    
    // Check for ML skills
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
    expect(screen.getByText('TensorFlow')).toBeInTheDocument();
    expect(screen.getByText('Computer Vision')).toBeInTheDocument();
    
    // Check for 3D Graphics skills
    expect(screen.getByText('Three.js')).toBeInTheDocument();
    expect(screen.getByText('WebGL')).toBeInTheDocument();
    expect(screen.getByText('Neural Rendering')).toBeInTheDocument();
    
    // Check for Development skills
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders contact links with correct attributes', () => {
    render(<AboutPage />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@neuralspace.dev');
  });

  it('renders the 3D neuron background', () => {
    render(<AboutPage />);
    
    expect(screen.getByTestId('neuron-background')).toBeInTheDocument();
  });
});