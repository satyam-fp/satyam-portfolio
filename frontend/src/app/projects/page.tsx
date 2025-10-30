'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProjects } from '@/lib/api';
import { Project } from '@/types/api';
import { Container, Section, Heading, Text, Card, Badge, Button, GridSkeleton } from '@/components/ui';
import { staggerContainer, staggerItem, fadeInUp } from '@/components/PageTransition';

function ProjectsGridSkeleton() {
  return <GridSkeleton count={6} columns="sm:grid-cols-2 lg:grid-cols-3" />;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover="hover"
      whileTap="tap"
    >
      <Card variant="project" className="group relative overflow-hidden" padding="none">
      {/* Neural Grid Background Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--primary), 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Project Image */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted via-muted to-primary/10">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 relative">
            {/* Animated Neural Nodes */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse"
                  style={{
                    top: `${20 + (i * 15)}%`,
                    left: `${15 + (i * 12)}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + i * 0.2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <Text size="sm" variant="muted" className="font-medium">Neural Project</Text>
            </div>
          </div>
        )}
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {project.github_url && (
            <Button
              size="icon"
              className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/80 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              asChild
            >
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </Button>
          )}
          {project.live_demo && (
            <Button
              size="icon"
              className="bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary border border-primary/40 hover:border-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110"
              asChild
            >
              <a
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </Button>
          )}
        </div>

        {/* Neural Connection Lines */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M0,50 Q25,20 50,50 T100,30" stroke="url(#neuralGradient)" strokeWidth="0.5" fill="none" className="animate-pulse" />
            <path d="M0,70 Q30,40 60,70 T100,50" stroke="url(#neuralGradient)" strokeWidth="0.3" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          </svg>
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <Heading level={3} className="group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
            {project.title}
          </Heading>
          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse group-hover:bg-primary group-hover:scale-150 transition-all duration-300"></div>
        </div>
        
        <Text size="responsive" variant="muted" leading="relaxed" className="mb-6 line-clamp-3 group-hover:text-muted-foreground/80 transition-colors">
          {project.description}
        </Text>
        
        {/* Enhanced Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack.slice(0, 4).map((tech, index) => (
            <Badge 
              key={tech} 
              variant="tech" 
              className="hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge variant="muted" className="hover:bg-muted/80 transition-colors">
              +{project.tech_stack.length - 4} more
            </Badge>
          )}
        </div>
        
        {/* Enhanced View Project Link */}
        <div className="flex items-center justify-between">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto group/link text-primary hover:text-primary/80 font-medium" 
            asChild
          >
            <Link href={`/projects/${project.slug}`}>
              <span className="relative">
                Explore Project
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300"></span>
              </span>
              <svg className="w-4 h-4 ml-2 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
          
          {/* Neural Activity Indicator */}
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-primary/40 rounded-full animate-pulse group-hover:bg-primary group-hover:scale-125 transition-all duration-300"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}

function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const projectsData = await getProjects();
        setProjects(projectsData || []);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <ProjectsGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to Load Projects</h3>
        <p className="text-muted-foreground mb-4">There was an error loading the projects. Please try again later.</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
        <p className="text-muted-foreground">Check back soon for new projects!</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}

export default function ProjectsPage() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
    >
      <Section spacing="default">
        <Container>
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Heading level={1} className="mb-4">Projects</Heading>
            <Text size="lg" variant="muted" className="sm:text-xl">
              Explore my work in Machine Learning and 3D AI applications
            </Text>
          </motion.div>

          <ProjectsGrid />
        </Container>
      </Section>
    </motion.div>
  );
}