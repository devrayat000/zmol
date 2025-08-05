import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Home } from 'lucide-react';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
          <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Expired
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Short URL Has Expired
          </h2>
          <p className="text-muted-foreground">
            This short URL has expired and is no longer available.
          </p>
        </div>

        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link href="/">
            <Home className="h-4 w-4" />
            Create a New Short URL
          </Link>
        </Button>
      </div>
    </div>
  );
}
