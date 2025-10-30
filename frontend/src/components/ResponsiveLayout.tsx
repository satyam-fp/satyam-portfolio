'use client';

import React from 'react';
import { useDeviceCapabilities } from '@/components/3d/MobileDetector';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveLayout({ 
  children, 
  className = '', 
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}: ResponsiveLayoutProps) {
  const capabilities = useDeviceCapabilities();
  
  const getResponsiveClassName = () => {
    let classes = className;
    
    if (capabilities.isMobile && mobileClassName) {
      classes += ` ${mobileClassName}`;
    } else if (capabilities.isTablet && tabletClassName) {
      classes += ` ${tabletClassName}`;
    } else if (capabilities.isDesktop && desktopClassName) {
      classes += ` ${desktopClassName}`;
    }
    
    return classes;
  };

  return (
    <div className={getResponsiveClassName()}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function ResponsiveContainer({ 
  children, 
  size = 'lg',
  className = ''
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };

  return (
    <div className={`container-mobile ${sizeClasses[size]} mx-auto ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  const gridCols = `grid-cols-${cols.mobile || 1} sm:grid-cols-${cols.tablet || 2} lg:grid-cols-${cols.desktop || 3}`;

  return (
    <div className={`grid ${gridCols} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

export function ResponsiveText({ 
  children, 
  size = 'base',
  className = ''
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm', 
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl',
    '4xl': 'text-3xl sm:text-4xl md:text-5xl'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}