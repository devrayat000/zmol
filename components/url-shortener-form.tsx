'use client';

import { useState, useTransition } from 'react';
import { createShortUrl, type ActionResult } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UrlShortenerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setResult(null);
    setShowAdvanced(false);
    setCopied(false);
  };

  if (result?.success && result.data?.shortCode) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {result.data.existing ? 'URL Found!' : 'Success!'}
          </h2>
          <p className="text-muted-foreground">
            {result.data.existing 
              ? 'This URL was already shortened. Here\'s your link:'
              : 'Your shortened URL is ready to share.'
            }
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Link className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="font-mono text-sm text-gray-900 dark:text-white truncate">
                {shortUrl}
              </span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
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
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={resetForm}>
            Create Another URL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Shorten Your URL
        </h2>
        <p className="text-muted-foreground">
          Paste your long URL below and get a short, shareable link instantly.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl">Original URL</Label>
          <Input
            id="originalUrl"
            name="originalUrl"
            type="url"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            required
            disabled={isPending}
            className="text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>
        </div>

        <div className={cn(
          'space-y-4 transition-all duration-300',
          showAdvanced ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        )}>
          <div className="space-y-2">
            <Label htmlFor="customCode">Custom Short Code (Optional)</Label>
            <Input
              id="customCode"
              name="customCode"
              placeholder="my-custom-link"
              disabled={isPending}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              3-20 characters. Letters, numbers, hyphens, and underscores only.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              name="title"
              placeholder="Page title"
              disabled={isPending}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Brief description"
              disabled={isPending}
              className="text-base"
            />
          </div>
        </div>

        {result && !result.success && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {result.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Short URL...
            </>
          ) : (
            <>
              <Link className="h-4 w-4" />
              Shorten URL
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
