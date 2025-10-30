import { render, screen } from '@testing-library/react';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveGrid } from '../ResponsiveLayout';

// Mock the device capabilities hook
jest.mock('../3d/MobileDetector', () => ({
  useDeviceCapabilities: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasWebGL: true,
    hasGoodPerformance: true,
    supportsTouch: false,
    screenSize: 'large'
  })
}));

describe('ResponsiveLayout Components', () => {
  test('ResponsiveLayout renders children correctly', () => {
    render(
      <ResponsiveLayout>
        <div>Test content</div>
      </ResponsiveLayout>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('ResponsiveContainer applies correct classes', () => {
    const { container } = render(
      <ResponsiveContainer size="md">
        <div>Container content</div>
      </ResponsiveContainer>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('max-w-4xl');
  });

  test('ResponsiveGrid renders with correct grid classes', () => {
    const { container } = render(
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <div>Grid item 1</div>
        <div>Grid item 2</div>
      </ResponsiveGrid>
    );
    
    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid');
  });
});