import { notFound } from 'next/navigation';
import { getUrlStats } from '@/lib/actions';
import { extractDomain, truncateText } from '@/lib/url-utils';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';
import { BarChart3, ExternalLink, ArrowLeft, Eye, Calendar, Globe } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function StatsPage({ params }: PageProps) {
  const { shortCode } = await params;
  const stats = await getUrlStats(shortCode);

  if (!stats) {
    notFound();
  }

  const { url, clickStats } = stats;
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`;
  const domain = extractDomain(url.originalUrl);

  const totalClicks = clickStats.reduce((sum, stat) => sum + stat.count, 0);
  const avgClicksPerDay = clickStats.length > 0 ? Math.round(totalClicks / clickStats.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild className="p-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                URL Statistics
              </h1>
              <p className="text-muted-foreground">
                Analytics for your shortened URL
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* URL Info Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {url.title || domain || 'Untitled URL'}
                    </h2>
                    {url.isCustom && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Short URL:</span>
                      <code className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                        {shortUrl}
                      </code>
                      <CopyButton 
                        text={shortUrl}
                        className="p-1 h-auto"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Original:</span>
                      <span className="truncate text-muted-foreground">
                        {truncateText(url.originalUrl, 80)}
                      </span>
                    </div>
                  </div>
                  
                  {url.description && (
                    <p className="text-sm text-muted-foreground">
                      {url.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit Short URL
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                    Visit Original
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {url.clicks.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgClicksPerDay}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. per Day</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Created</p>
                </div>
              </div>
            </div>
          </div>

          {/* Click History */}
          {clickStats.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Click History (Last 30 Days)
              </h3>
              
              <div className="space-y-2">
                {clickStats.map((stat) => {
                  const percentage = totalClicks > 0 ? (stat.count / totalClicks) * 100 : 0;
                  
                  return (
                    <div key={stat.date} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-muted-foreground">
                        {new Date(stat.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right text-gray-900 dark:text-white font-medium">
                        {stat.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {clickStats.length === 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No clicks yet
              </h3>
              <p className="text-muted-foreground">
                Once people start clicking your link, you&apos;ll see detailed analytics here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
