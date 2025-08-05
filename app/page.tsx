import { Suspense } from 'react';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { RecentUrls } from '@/components/recent-urls';
import { StatsCards } from '@/components/stats-cards';
import { LoadingCard } from '@/components/loading';
import { Link2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zmol
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform long URLs into short, memorable links. Track clicks, customize codes, and manage your links with ease.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* URL Shortener Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 md:p-8">
            <UrlShortenerForm />
          </div>

          {/* Stats Cards */}
          <Suspense fallback={<LoadingCard className="h-32" />}>
            <StatsCards />
          </Suspense>

          {/* Recent URLs */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span>Recent URLs</span>
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            </h2>
            <Suspense fallback={<div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingCard key={i} className="h-16" />
              ))}
            </div>}>
              <RecentUrls />
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-muted-foreground">
          <p>&copy; 2025 Zmol. Built with Next.js 15 and ❤️</p>
        </footer>
      </div>
    </div>
  );
}
