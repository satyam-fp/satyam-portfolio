'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h4>
          ),
          
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground">
              {children}
            </p>
          ),
          
          // Custom list styles
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 space-y-2 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 space-y-2 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          
          // Custom code styles
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            
            if (!inline && match) {
              // Block code with syntax highlighting
              return (
                <div className="relative mb-4">
                  <pre className="bg-muted rounded-lg p-4 overflow-x-auto border">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            
            // Inline code
            return (
              <code 
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // Custom link styles
          a: ({ href, children }) => (
            <a 
              href={href}
              className="text-primary hover:underline font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          
          // Custom table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {children}
            </td>
          ),
          
          // Custom horizontal rule
          hr: () => (
            <hr className="my-8 border-border" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}