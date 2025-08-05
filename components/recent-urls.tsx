import { getRecentUrls } from '@/lib/actions';
import { extractDomain, truncateText } from '@/lib/url-utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

export async function RecentUrls() {
  const recentUrls = await getRecentUrls(10);

  if (recentUrls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No URLs yet
        </h3>
        <p className="text-muted-foreground">
          Your shortened URLs will appear here once you create them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentUrls.map((url) => {
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`;
        const domain = extractDomain(url.originalUrl);
        
        return (
          <div
            key={url.id}
            className="group flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {url.title || domain || 'Untitled'}
                </h3>
                {url.isCustom && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    Custom
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                <span className="font-mono truncate">
                  {shortUrl}
                </span>
                <span className="hidden sm:block">→</span>
                <span className="truncate">
                  {truncateText(url.originalUrl, 60)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {url.clicks} clicks
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={`/stats/${url.shortCode}`}>
                  <BarChart3 className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
