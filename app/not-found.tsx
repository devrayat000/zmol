import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4 glow-border">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold gradient-text">
            404
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            Short URL Not Found
          </h2>
          <p className="text-muted-foreground">
            The short URL you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <Button asChild className="glow-border bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
