'use client';

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasWebGL: boolean;
  hasGoodPerformance: boolean;
  supportsTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasWebGL: true,
    hasGoodPerformance: true,
    supportsTouch: false,
    screenSize: 'large'
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Screen size detection
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Touch support detection
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // WebGL support detection
      let hasWebGL = false;
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        hasWebGL = !!gl;
      } catch {
        hasWebGL = false;
      }
      
      // Performance estimation based on device characteristics
      const hasGoodPerformance = (() => {
        // Basic heuristics for performance estimation
        const userAgent = navigator.userAgent.toLowerCase();
        const isOldMobile = /android [1-4]|iphone os [1-9]_|ipad.*os [1-9]_/.test(userAgent);
        const isLowEndDevice = width < 768 && height < 1024;
        const hasLimitedMemory = 'deviceMemory' in navigator && (navigator as { deviceMemory?: number }).deviceMemory && (navigator as { deviceMemory: number }).deviceMemory < 4;
        
        // Consider it low performance if it's an old mobile device or has limited specs
        return !isOldMobile && !(isLowEndDevice && hasLimitedMemory);
      })();
      
      const screenSize: 'small' | 'medium' | 'large' = 
        width < 768 ? 'small' : 
        width < 1024 ? 'medium' : 'large';

      setCapabilities({
        isMobile,
        isTablet,
        isDesktop,
        hasWebGL,
        hasGoodPerformance,
        supportsTouch,
        screenSize
      });
    };

    // Initial detection
    detectCapabilities();

    // Re-detect on resize
    const handleResize = () => {
      detectCapabilities();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}

export function shouldUse3D(capabilities: DeviceCapabilities): boolean {
  // Use 3D only if device has WebGL, good performance, and is not a small mobile device
  return capabilities.hasWebGL && 
         capabilities.hasGoodPerformance && 
         !capabilities.isMobile;
}

export function shouldUseReducedEffects(capabilities: DeviceCapabilities): boolean {
  // Use reduced effects on tablets or devices with limited performance
  return capabilities.isTablet || !capabilities.hasGoodPerformance;
}