import { render, screen } from '@testing-library/react';
import { NeuralScene } from '../NeuralScene';

// Mock Three.js for testing
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: jest.fn(),
  useThree: () => ({
    camera: { position: { set: jest.fn() } },
    gl: { domElement: document.createElement('canvas') },
    raycaster: {},
    pointer: { x: 0, y: 0 },
    size: { width: 800, height: 600 }
  }),
}));

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
  CameraControls: ({ children }: { children?: React.ReactNode }) => <div data-testid="camera-controls">{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <div data-testid="text">{children}</div>,
}));

describe('NeuralScene', () => {
  const sampleProjects = [
    {
      id: 1,
      title: 'Test Project',
      description: 'A test project',
      tech_stack: ['React', 'TypeScript'],
    },
  ];

  const sampleBlogs = [
    {
      id: 1,
      title: 'Test Blog',
      summary: 'A test blog post',
      content: 'Test content',
    },
  ];

  it('renders without crashing', () => {
    render(<NeuralScene />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders with custom projects and blogs', () => {
    render(<NeuralScene projects={sampleProjects} blogs={sampleBlogs} />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('shows debug info in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<NeuralScene />);
    
    // Check for debug info elements
    expect(screen.getByText(/Nodes:/)).toBeInTheDocument();
    expect(screen.getByText(/Interactive: ✓ Hover, Click, Camera/)).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('applies custom className', () => {
    const { container } = render(<NeuralScene className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});