import { unstable_cache } from 'next/cache';
import { db, urls, urlClicks } from '@/lib/db';
import { eq, sql, desc } from 'drizzle-orm';

// Cache keys and tags
export const CACHE_KEYS = {
  URL_BY_SHORTCODE: 'url-by-shortcode',
  RECENT_URLS: 'recent-urls',
  URL_STATS: 'url-stats',
  APP_STATS: 'app-stats',
  MIDDLEWARE_URL: 'middleware-url',
} as const;

export const CACHE_TAGS = {
  URL: 'url',
  URLS: 'urls',
  CLICKS: 'clicks',
  STATS: 'stats',
  RECENT: 'recent',
  URL_STATS: 'url-stats',
} as const;

// Cached database operations
export const getCachedUrlByShortCode = unstable_cache(
  async (shortCode: string) => {
    try {
      const result = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching URL:', error);
      return null;
    }
  },
  [CACHE_KEYS.URL_BY_SHORTCODE],
  {
    tags: [CACHE_TAGS.URL],
    revalidate: 3600, // 1 hour
  }
);

export const getCachedRecentUrls = unstable_cache(
  async (limit = 10) => {
    try {
      const result = await db
        .select()
        .from(urls)
        .orderBy(desc(urls.createdAt))
        .limit(limit);
      return result;
    } catch (error) {
      console.error('Error fetching recent URLs:', error);
      return [];
    }
  },
  [CACHE_KEYS.RECENT_URLS],
  {
    tags: [CACHE_TAGS.URLS, CACHE_TAGS.RECENT],
    revalidate: 300, // 5 minutes
  }
);

export const getCachedUrlStats = unstable_cache(
  async (shortCode: string) => {
    try {
      const url = await getCachedUrlByShortCode(shortCode);
      if (!url) return null;

      const clickStats = await db
        .select({
          date: sql<string>`DATE(${urlClicks.clickedAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count')
        })
        .from(urlClicks)
        .where(eq(urlClicks.urlId, url.id))
        .groupBy(sql`DATE(${urlClicks.clickedAt})`)
        .orderBy(sql`DATE(${urlClicks.clickedAt}) DESC`)
        .limit(30);

      return {
        url,
        clickStats
      };
    } catch (error) {
      console.error('Error fetching URL stats:', error);
      return null;
    }
  },
  [CACHE_KEYS.URL_STATS],
  {
    tags: [CACHE_TAGS.URL_STATS, CACHE_TAGS.CLICKS],
    revalidate: 600, // 10 minutes
  }
);

export const getCachedAppStats = unstable_cache(
  async () => {
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
      console.error('Error fetching app stats:', error);
      return {
        totalUrls: 0,
        totalClicks: 0,
        recentUrls: 0,
      };
    }
  },
  [CACHE_KEYS.APP_STATS],
  {
    tags: [CACHE_TAGS.URLS, CACHE_TAGS.CLICKS, CACHE_TAGS.STATS],
    revalidate: 300, // 5 minutes
  }
);

// Middleware-specific cached URL lookup
export const getMiddlewareCachedUrl = unstable_cache(
  async (shortCode: string) => {
    try {
      const result = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching URL in middleware:', error);
      return null;
    }
  },
  [CACHE_KEYS.MIDDLEWARE_URL],
  {
    tags: [CACHE_TAGS.URL],
    revalidate: 3600, // 1 hour
  }
);
