'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  const Component = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    animate: {
      opacity: [0.5, 0.8, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  } : {};

  return (
    <Component
      className={cn(
        'bg-gradient-to-r from-muted via-muted/80 to-muted rounded-md',
        className
      )}
      {...animationProps}
    />
  );
}

// Specialized skeleton components
export function ProjectCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      <Skeleton className="aspect-video" />
      <div className="p-4 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-5/6" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-10 sm:w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
      </div>
    </motion.div>
  );
}

export function BlogCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-border rounded-lg p-6 space-y-4"
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-4 w-20" />
    </motion.div>
  );
}

export function NeuralSceneSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center h-full bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="text-center space-y-6">
        {/* Neural network loading animation */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Central node */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Surrounding nodes */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = 40;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-primary/60 rounded-full"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            );
          })}
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 40;
              const x = Math.cos(angle) * radius + 64;
              const y = Math.sin(angle) * radius + 64;
              
              return (
                <motion.line
                  key={i}
                  x1="64"
                  y1="64"
                  x2={x}
                  y2={y}
                  stroke="rgb(59 130 246 / 0.3)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 0.5,
                  }}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="space-y-2">
          <motion.p
            className="text-foreground font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing Neural Network
          </motion.p>
          <motion.p
            className="text-muted-foreground font-mono text-sm"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            Loading 3D scene and neural connections...
          </motion.p>
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function GridSkeleton({ 
  count = 6, 
  columns = 'sm:grid-cols-2 lg:grid-cols-3' 
}: { 
  count?: number; 
  columns?: string; 
}) {
  return (
    <motion.div
      className={`grid ${columns} gap-4 sm:gap-6`}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}