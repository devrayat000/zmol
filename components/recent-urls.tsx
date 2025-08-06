import { getCachedRecentUrls } from '@/lib/cache';
import { extractDomain, truncateText } from '@/lib/url-utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, BarChart3, Clock, Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export async function RecentUrls() {
  const recentUrls = await getCachedRecentUrls(10);

  if (recentUrls.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-4 glow-border">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          No URLs yet
        </h3>
        <p className="text-muted-foreground">
          Your shortened URLs will appear here once you create them.
        </p>
      </div>
    );
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      {recentUrls.map((url) => {
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`;
        const domain = extractDomain(url.originalUrl);
        
        return (
          <div
            key={url.id}
            className="group flex items-center gap-4 p-4 glass-effect rounded-lg glow-border card-hover"
          >
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-foreground truncate text-lg">
                  {url.title || domain || 'Untitled'}
                </h3>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <span className="font-mono text-primary truncate glow-border px-2 py-1 rounded bg-primary/5">
                  {shortUrl}
                </span>
                <span className="hidden sm:block text-muted-foreground">→</span>
                <span className="truncate text-muted-foreground">
                  {truncateText(url.originalUrl, 50)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {url.clicks.toLocaleString()} clicks
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyUrl(shortUrl)}
                      className="glow-border"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="glow-border"
                    >
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      })}
    </div>
  );
}
