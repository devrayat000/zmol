'use client';

import { useState, useTransition } from 'react';
import { createShortUrl, type ActionResult } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, Copy, Check, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function UrlShortenerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const shortUrl = result?.data?.shortCode 
    ? `${window.location.origin}/${result.data.shortCode}`
    : '';

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const response = await createShortUrl(formData);
      setResult(response);
    });
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setResult(null);
    setCopied(false);
  };

  if (result?.success && result.data?.shortCode) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4 glow-border">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {result.data.existing ? '🎯 URL Found!' : '✨ Success!'}
          </h2>
          <p className="text-muted-foreground">
            {result.data.existing 
              ? 'This URL was already shortened. Here\'s your link:'
              : 'Your shortened URL is ready to share.'
            }
          </p>
        </div>

        <div className="glass-effect rounded-lg p-4 glow-border">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Link className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-mono text-sm text-foreground truncate">
                {shortUrl}
              </span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="glow-border"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="glow-border"
                    >
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={resetForm} className="glow-border">
            <Sparkles className="h-4 w-4" />
            Create Another URL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 gradient-text">
          Shorten Your URL
        </h2>
        <p className="text-muted-foreground">
          Paste your long URL below and get a short, shareable link instantly.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="originalUrl" className="text-base font-medium">Original URL</Label>
          <Input
            id="originalUrl"
            name="originalUrl"
            type="url"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            required
            disabled={isPending}
            className="text-base h-12 glow-border focus:glow-border-strong transition-all"
          />
        </div>

        {result && !result.success && (
          <div className="p-4 glass-effect border border-red-500/20 rounded-lg glow-border">
            <p className="text-sm text-red-500">
              {result.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground border-0 glow-border-strong"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Short URL...
            </>
          ) : (
            <>
              <Link className="h-5 w-5" />
              Shorten URL
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
