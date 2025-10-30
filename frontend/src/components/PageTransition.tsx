'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Animation variants for different page types
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

// Specialized variants for the home page (3D scene)
const homeVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.05,
  },
};

// Transition configuration
const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4,
};

const homeTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.6,
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Use different animations for home page vs other pages
  const variants = isHomePage ? homeVariants : pageVariants;
  const transition = isHomePage ? homeTransition : pageTransition;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={transition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Higher-order component for wrapping page content
export function withPageTransition<T extends object>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: T) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
}

// Stagger animation for lists and grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

// Fade in animation for content sections
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

// Scale animation for interactive elements
export const scaleOnHover = {
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Neural network inspired animations
export const neuralPulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const neuralGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 40px rgba(59, 130, 246, 0.6)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};