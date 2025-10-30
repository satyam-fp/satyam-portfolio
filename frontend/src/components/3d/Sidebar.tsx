'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Node3DData } from '@/types/3d';
import { Project, Blog } from '@/types/api';
import { Button, Badge, Text, Heading } from '@/components/ui';

interface SidebarProps {
  selectedNode: Node3DData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Type guards to determine node data type
const isProject = (data: unknown): data is Project => {
  return data !== null && typeof data === 'object' && 'tech_stack' in data && 'github_url' in data;
};

const isBlog = (data: unknown): data is Blog => {
  return data !== null && typeof data === 'object' && 'content' in data && 'slug' in data;
};

// Project content component
const ProjectContent: React.FC<{ project: Project }> = ({ project }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Badge variant="neural" className="text-xs">
        <Tag size={12} className="mr-1" />
        PROJECT
      </Badge>
      <Heading level={2} variant="neural" className="leading-tight">
        {project.title}
      </Heading>
    </div>

    {/* Description */}
    <div className="space-y-2">
      <Heading level={3} className="text-foreground">Description</Heading>
      <Text leading="relaxed" className="text-muted-foreground">
        {project.description}
      </Text>
    </div>

    {/* Tech Stack */}
    {project.tech_stack && project.tech_stack.length > 0 && (
      <div className="space-y-3">
        <Heading level={3} className="text-foreground">Tech Stack</Heading>
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech, index) => (
            <Badge key={index} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Links */}
    {(project.github_url || project.live_demo) ? (
      <div className="space-y-3">
        <Heading level={3} className="text-foreground">Links</Heading>
        <div className="flex flex-col gap-2">
          {project.github_url && (
            <Button variant="outline" asChild className="justify-start">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                View on GitHub
                <ExternalLink size={14} className="ml-auto" />
              </a>
            </Button>
          )}
          {project.live_demo && (
            <Button variant="neural" asChild className="justify-start">
              <a
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} />
                Live Demo
                <ExternalLink size={14} className="ml-auto" />
              </a>
            </Button>
          )}
        </div>
      </div>
    ) : (
      <div className="space-y-3">
        <Heading level={3} className="text-foreground">Project Status</Heading>
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <Text size="sm" leading="relaxed" className="text-muted-foreground mb-3">
            This is a demonstration project. Links to GitHub repository and live demo will be available when the project is published.
          </Text>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <ExternalLink size={16} />
            View Project Details
          </Button>
        </div>
      </div>
    )}

    {/* Metadata */}
    <div className="pt-4 border-t border-border">
      <Text as="div" size="sm" variant="muted" className="flex items-center gap-2">
        <Calendar size={16} />
        Created {new Date(project.created_at).toLocaleDateString()}
      </Text>
    </div>
  </div>
);

// Blog content component
const BlogContent: React.FC<{ blog: Blog }> = ({ blog }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Badge variant="neural" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
        <Tag size={12} className="mr-1" />
        BLOG POST
      </Badge>
      <Heading level={2} variant="neural" className="leading-tight">
        {blog.title}
      </Heading>
    </div>

    {/* Summary */}
    {blog.summary && (
      <div className="space-y-2">
        <Heading level={3} className="text-foreground">Summary</Heading>
        <Text leading="relaxed" className="text-muted-foreground">
          {blog.summary}
        </Text>
      </div>
    )}

    {/* Content Preview */}
    <div className="space-y-2">
      <Heading level={3} className="text-foreground">Content Preview</Heading>
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <Text size="sm" leading="relaxed" className="text-muted-foreground">
          {blog.content && blog.content.length > 0 ? (
            blog.content.length > 300 
              ? `${blog.content.substring(0, 300)}...`
              : blog.content
          ) : (
            "This is a demonstration blog post. Full content will be available when the article is published."
          )}
        </Text>
        {blog.content && blog.content.length > 300 && (
          <Button variant="link" size="sm" className="mt-3 p-0 h-auto text-primary">
            Read full article →
          </Button>
        )}
      </div>
    </div>

    {/* Metadata */}
    <div className="pt-4 border-t border-border">
      <Text as="div" size="sm" variant="muted" className="flex items-center gap-2">
        <Calendar size={16} />
        Published {new Date(blog.created_at).toLocaleDateString()}
      </Text>
    </div>
  </div>
);

// Main Sidebar component
export const Sidebar: React.FC<SidebarProps> = ({ selectedNode, isOpen, onClose }) => {
  // Don't render anything if no node is selected
  if (!selectedNode || !selectedNode.data) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md md:max-w-lg bg-card/95 backdrop-blur-md border-l border-primary/20 shadow-2xl z-50 overflow-hidden neural-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full neural-pulse ${
                  selectedNode.type === 'project' ? 'bg-primary' : 'bg-green-400'
                }`} />
                <Text weight="medium" className="text-foreground">Node Details</Text>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
              {/* Neural grid background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--primary), 0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>
              <div className="relative z-10">
                {isProject(selectedNode.data) && (
                  <ProjectContent project={selectedNode.data} />
                )}
                {isBlog(selectedNode.data) && (
                  <BlogContent blog={selectedNode.data} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border/50 bg-gradient-to-r from-transparent to-primary/5">
              <Text as="div" size="xs" variant="muted" align="center" className="flex items-center justify-center gap-2">
                <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Click outside or press ESC to close</span>
                <span className="sm:hidden">Tap outside to close</span>
                <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse"></div>
              </Text>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;