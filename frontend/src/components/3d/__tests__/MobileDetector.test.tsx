import { renderHook } from '@testing-library/react';
import { useDeviceCapabilities, shouldUse3D, shouldUseReducedEffects } from '../MobileDetector';

// Mock window properties
const mockWindow = (width: number, height: number, userAgent: string) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: userAgent,
  });
};

describe('MobileDetector', () => {
  beforeEach(() => {
    // Reset to desktop defaults
    mockWindow(1920, 1080, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  });

  test('detects desktop correctly', () => {
    const { result } = renderHook(() => useDeviceCapabilities());
    
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.screenSize).toBe('large');
  });

  test('detects mobile correctly', () => {
    mockWindow(375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
    
    const { result } = renderHook(() => useDeviceCapabilities());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.screenSize).toBe('small');
  });

  test('shouldUse3D returns false for mobile', () => {
    const mobileCapabilities = {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      hasWebGL: true,
      hasGoodPerformance: true,
      supportsTouch: true,
      screenSize: 'small' as const
    };
    
    expect(shouldUse3D(mobileCapabilities)).toBe(false);
  });

  test('shouldUse3D returns true for desktop with WebGL', () => {
    const desktopCapabilities = {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasWebGL: true,
      hasGoodPerformance: true,
      supportsTouch: false,
      screenSize: 'large' as const
    };
    
    expect(shouldUse3D(desktopCapabilities)).toBe(true);
  });

  test('shouldUseReducedEffects returns true for tablet', () => {
    const tabletCapabilities = {
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      hasWebGL: true,
      hasGoodPerformance: false,
      supportsTouch: true,
      screenSize: 'medium' as const
    };
    
    expect(shouldUseReducedEffects(tabletCapabilities)).toBe(true);
  });
});