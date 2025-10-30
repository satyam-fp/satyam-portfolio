'use client';

import { NeuronBackground } from '@/components/3d';
import { Container, Section, Heading, Text, Card, Badge, Button } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Neuron Background Animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <NeuronBackground intensity={0.8} />
      </div>
      
      <Section spacing="default" className="relative z-10">
        <Container size="lg">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Profile Photo with Neural Network Border Effect */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center relative overflow-hidden">
                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse"></div>
                <div className="absolute inset-1 rounded-full border border-primary/20"></div>
                
                {/* Profile photo placeholder with better styling */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-background flex items-center justify-center text-primary/60 font-mono text-sm">
                  ML.ENG
                </div>
              </div>
              
              {/* Floating particles around profile */}
              <div className="absolute -inset-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
                    style={{
                      top: `${20 + Math.sin((i / 6) * Math.PI * 2) * 30 + 30}%`,
                      left: `${20 + Math.cos((i / 6) * Math.PI * 2) * 30 + 30}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${2 + i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <Heading level={1} variant="gradient" align="center" className="mb-4">
              About Me
            </Heading>
            <Text size="lg" variant="muted" align="center" leading="relaxed" className="max-w-2xl mx-auto sm:text-xl">
              Machine Learning Engineer specializing in AI for 3D applications with 3 years of development experience
            </Text>
          </div>

          {/* Bio Section */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
            <div className="space-y-6">
              <Card variant="glass">
                <Heading level={2} className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Background
                </Heading>
                <div className="space-y-4">
                  <Text variant="muted" leading="relaxed">
                    I&apos;m a passionate Machine Learning Engineer with a focus on the intersection of AI and 3D graphics. 
                    Over the past 3 years, I&apos;ve been developing cutting-edge solutions that bridge the gap between 
                    traditional computer graphics and modern deep learning techniques.
                  </Text>
                  <Text variant="muted" leading="relaxed">
                    My expertise spans from 3D computer vision and neural rendering to real-time graphics optimization. 
                    I enjoy tackling complex problems that require both theoretical understanding and practical 
                    implementation skills.
                  </Text>
                  <Text variant="muted" leading="relaxed">
                    When I&apos;m not coding, you can find me exploring the latest research papers, contributing to 
                    open-source projects, or experimenting with new 3D visualization techniques.
                  </Text>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="glass">
                <Heading level={2} className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Expertise
                </Heading>
                <div className="space-y-6">
                  <div>
                    <Heading level={3} variant="primary" className="mb-3">Machine Learning</Heading>
                    <div className="flex flex-wrap gap-2">
                      {['PyTorch', 'TensorFlow', 'Computer Vision', 'Deep Learning', 'Neural Networks'].map((skill) => (
                        <Badge key={skill} variant="tech" className="hover:bg-primary/20 transition-colors cursor-default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Heading level={3} variant="primary" className="mb-3">3D Graphics</Heading>
                    <div className="flex flex-wrap gap-2">
                      {['Three.js', 'WebGL', 'OpenGL', 'Point Clouds', 'Neural Rendering'].map((skill) => (
                        <Badge key={skill} variant="tech" className="hover:bg-primary/20 transition-colors cursor-default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Heading level={3} variant="primary" className="mb-3">Development</Heading>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'CUDA'].map((skill) => (
                        <Badge key={skill} variant="tech" className="hover:bg-primary/20 transition-colors cursor-default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            <Card variant="glass" className="text-center group hover:bg-card/70 transition-all duration-300 touch-manipulation">
              <Text size="2xl" variant="primary" weight="bold" className="mb-2 group-hover:scale-110 transition-transform duration-300 sm:text-4xl">
                3+
              </Text>
              <Text size="responsive" variant="muted" weight="medium">Years Experience</Text>
              <Text size="xs" className="text-muted-foreground/70 mt-1">ML Engineering</Text>
            </Card>
            <Card variant="glass" className="text-center group hover:bg-card/70 transition-all duration-300 touch-manipulation">
              <Text size="2xl" variant="primary" weight="bold" className="mb-2 group-hover:scale-110 transition-transform duration-300 sm:text-4xl">
                15+
              </Text>
              <Text size="responsive" variant="muted" weight="medium">Projects Completed</Text>
              <Text size="xs" className="text-muted-foreground/70 mt-1">AI & 3D Applications</Text>
            </Card>
            <Card variant="glass" className="text-center group hover:bg-card/70 transition-all duration-300 touch-manipulation sm:col-span-2 md:col-span-1">
              <Text size="2xl" variant="primary" weight="bold" className="mb-2 group-hover:scale-110 transition-transform duration-300 sm:text-4xl">
                5+
              </Text>
              <Text size="responsive" variant="muted" weight="medium">Research Papers</Text>
              <Text size="xs" className="text-muted-foreground/70 mt-1">Published & Cited</Text>
            </Card>
          </div>

          {/* Contact */}
          <div className="text-center">
            <Card variant="glass" padding="lg">
              <Heading level={2} className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Let&apos;s Connect
              </Heading>
              <Text variant="muted" className="mb-8 max-w-md mx-auto">
                Interested in collaborating on AI and 3D projects? Let&apos;s discuss how we can work together.
              </Text>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <Button variant="outline" size="lg" className="group" asChild>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="group" asChild>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </Button>
                <Button size="lg" className="group shadow-lg hover:shadow-primary/25" asChild>
                  <a href="mailto:contact@neuralspace.dev">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}