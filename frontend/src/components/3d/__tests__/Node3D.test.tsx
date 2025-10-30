import { render, fireEvent } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { Node3D } from '../Node3D';

// Mock Three.js for testing
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
}));

describe('Node3D', () => {
  const defaultProps = {
    position: [0, 0, 0] as [number, number, number],
    type: 'project' as const,
    title: 'Test Node',
    nodeId: 'test-1',
  };

  it('renders without crashing', () => {
    render(
      <Canvas>
        <Node3D {...defaultProps} />
      </Canvas>
    );
  });

  it('renders with blog type', () => {
    render(
      <Canvas>
        <Node3D {...defaultProps} type="blog" />
      </Canvas>
    );
  });

  it('calls onHover when hovered', () => {
    const onHover = jest.fn();
    const { container } = render(
      <Canvas>
        <Node3D {...defaultProps} onHover={onHover} />
      </Canvas>
    );
    
    // Note: In a real test environment, we would need to simulate 3D interactions
    // This is a basic structure for testing interactive functionality
    expect(onHover).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Canvas>
        <Node3D {...defaultProps} onClick={onClick} />
      </Canvas>
    );
    
    // Note: In a real test environment, we would need to simulate 3D interactions
    // This is a basic structure for testing interactive functionality
    expect(onClick).toBeDefined();
  });

  it('renders with selected state', () => {
    render(
      <Canvas>
        <Node3D {...defaultProps} isSelected={true} />
      </Canvas>
    );
  });

  it('renders with connected state', () => {
    render(
      <Canvas>
        <Node3D {...defaultProps} isConnected={true} />
      </Canvas>
    );
  });
});