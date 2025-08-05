import { db, urls } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { Link2, BarChart3, TrendingUp, Clock } from 'lucide-react';

async function getStats() {
  try {
    const [totalUrls, totalClicks, recentUrls] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(urls),
      db.select({ total: sql<number>`sum(${urls.clicks})` }).from(urls),
      db.select({ count: sql<number>`count(*)` }).from(urls).where(sql`${urls.createdAt} >= NOW() - INTERVAL '7 days'`)
    ]);

    return {
      totalUrls: totalUrls[0]?.count || 0,
      totalClicks: totalClicks[0]?.total || 0,
      recentUrls: recentUrls[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalUrls: 0,
      totalClicks: 0,
      recentUrls: 0,
    };
  }
}

export async function StatsCards() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Total URLs',
      value: stats.totalUrls.toLocaleString(),
      icon: Link2,
      description: 'URLs shortened',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: BarChart3,
      description: 'Times clicked',
      color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'This Week',
      value: stats.recentUrls.toLocaleString(),
      icon: TrendingUp,
      description: 'New URLs created',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Average',
      value: stats.totalUrls > 0 ? Math.round(stats.totalClicks / stats.totalUrls).toLocaleString() : '0',
      icon: Clock,
      description: 'Clicks per URL',
      color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
