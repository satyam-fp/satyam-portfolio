import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProject } from '@/lib/api';
import { Project } from '@/types/api';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  let project: Project;
  
  try {
    project = await getProject(slug);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary font-mono border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
              {project.live_demo && (
                <a
                  href={project.live_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-border hover:bg-accent transition-all duration-200 hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Project Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-border">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Project Preview</h3>
                  <p className="text-muted-foreground">Screenshot or demo coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Content - Enhanced for better readability */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="bg-card/50 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Project Details</h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p className="text-lg">
                  This project showcases advanced techniques in machine learning and 3D AI applications. 
                  The implementation demonstrates practical solutions to real-world problems using cutting-edge technology.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Advanced ML algorithms implementation
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Real-time 3D processing capabilities
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Optimized performance and scalability
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Production-ready implementation
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Technical Highlights</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Modern deep learning frameworks
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        GPU acceleration and optimization
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Comprehensive testing and validation
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Detailed documentation and examples
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Metadata */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Created: {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              
              {/* Additional Actions */}
              <div className="flex gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Source →
                  </a>
                )}
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  More Projects →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}