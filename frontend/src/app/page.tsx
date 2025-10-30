'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { NeuralScene } from '@/components/3d/NeuralScene';
import { SceneLoading } from '@/components/3d/SceneLoading';
import { Container, Section, Heading, Text, Card } from '@/components/ui';
import { staggerContainer, staggerItem, fadeInUp, neuralPulse, neuralGlow } from '@/components/PageTransition';

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.6 }}
    >
      {/* Hero Section with 3D Neural Network */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          {/* 3D Scene */}
          <Suspense fallback={<SceneLoading />}>
            <NeuralScene className="w-full h-full" />
          </Suspense>
          
          {/* Overlay content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="text-center space-y-4 md:space-y-6 z-10 px-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={neuralGlow}
                animate="animate"
              >
                <Heading level={1} variant="neural" align="center" className="drop-shadow-lg">
                  Neural Space
                </Heading>
              </motion.div>
              <Text size="responsive" variant="muted" align="center" leading="relaxed" className="max-w-2xl mx-auto drop-shadow-md text-lg sm:text-xl md:text-2xl">
                Explore an interactive neural network representing my journey in Machine Learning and AI
              </Text>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Text size="xs" variant="muted" font="mono" align="center" className="sm:text-sm">
                  <span className="hidden sm:inline">Click and drag to navigate • Hover over nodes to explore</span>
                  <span className="sm:hidden">Tap nodes to explore projects and blog posts</span>
                </Text>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <Section spacing="default">
        <Container size="lg">
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={staggerItem}>
              <Card variant="neural" className="text-center group relative overflow-hidden card-scan-line">
                {/* Neural particles effect */}
                <div className="neural-particles">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="neural-particle"
                      style={{
                        left: `${20 + i * 20}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300"
                  variants={neuralPulse}
                  animate="animate"
                >
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </motion.div>
                
                <Heading level={3} className="mb-3 group-hover:text-primary transition-all duration-300">Projects</Heading>
                <Text size="responsive" variant="muted" className="group-hover:text-muted-foreground/80 transition-colors">
                  Explore ML and 3D AI projects with interactive demonstrations
                </Text>
                
                {/* Status indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full animate-pulse group-hover:bg-primary group-hover:scale-150 transition-all duration-300"></div>
              </Card>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <Card variant="neural" className="text-center group relative overflow-hidden card-scan-line">
                {/* Neural particles effect */}
                <div className="neural-particles">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="neural-particle"
                      style={{
                        left: `${15 + i * 25}%`,
                        animationDelay: `${i * 0.3 + 1}s`,
                        animationDuration: `${3.5 + i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-400/10 flex items-center justify-center border border-green-400/20 group-hover:scale-110 group-hover:border-green-400/40 transition-all duration-300"
                  variants={neuralPulse}
                  animate="animate"
                >
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.div>
                
                <Heading level={3} className="mb-3 group-hover:text-green-400 transition-all duration-300">Blog</Heading>
                <Text size="responsive" variant="muted" className="group-hover:text-muted-foreground/80 transition-colors">
                  Technical insights and learning journey in AI development
                </Text>
                
                {/* Status indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/40 rounded-full animate-pulse group-hover:bg-green-400 group-hover:scale-150 transition-all duration-300"></div>
              </Card>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <Card variant="neural" className="text-center group relative overflow-hidden card-scan-line sm:col-span-2 md:col-span-1">
                {/* Neural particles effect */}
                <div className="neural-particles">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="neural-particle"
                      style={{
                        left: `${10 + i * 20}%`,
                        animationDelay: `${i * 0.4 + 0.5}s`,
                        animationDuration: `${4 + i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 flex items-center justify-center border border-blue-400/20 group-hover:scale-110 group-hover:border-blue-400/40 transition-all duration-300"
                  variants={neuralPulse}
                  animate="animate"
                >
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </motion.div>
                
                <Heading level={3} className="mb-3 group-hover:text-blue-400 transition-all duration-300">About</Heading>
                <Text size="responsive" variant="muted" className="group-hover:text-muted-foreground/80 transition-colors">
                  Learn about my background in ML engineering and 3D applications
                </Text>
                
                {/* Status indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse group-hover:bg-blue-400 group-hover:scale-150 transition-all duration-300"></div>
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </motion.div>
  );
}
