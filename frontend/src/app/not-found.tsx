import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}