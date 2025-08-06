import { NextRequest, NextResponse } from 'next/server';
import { db, urls, urlClicks } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { getMiddlewareCachedUrl, CACHE_TAGS } from '@/lib/cache';
import { revalidateTag } from 'next/cache';

// Simplified click tracking for middleware
async function trackClickInMiddleware(urlId: number, userAgent?: string, referer?: string, ip?: string) {
  try {
    await Promise.all([
      db.insert(urlClicks).values({
        urlId,
        userAgent: userAgent || null,
        referer: referer || null,
        ipAddress: ip || 'unknown',
      }),
      db.update(urls).set({ 
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: new Date()
      }).where(eq(urls.id, urlId))
    ]);

    // Invalidate click-related caches
    revalidateTag(CACHE_TAGS.CLICKS);
    revalidateTag(CACHE_TAGS.URLS);
  } catch (error) {
    console.error('Error tracking click in middleware:', error);
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for specific paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname === '/expired' ||
    pathname === '/404' ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract short code from pathname
  const shortCode = pathname.slice(1);
  
  if (!shortCode) {
    return NextResponse.next();
  }

  try {
    // Get URL data from database
    const url = await getMiddlewareCachedUrl(shortCode);
    
    if (!url) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      return NextResponse.redirect(new URL('/expired', request.url));
    }

    // Track the click asynchronously (don't await to avoid blocking redirect)
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    trackClickInMiddleware(
      url.id,
      request.headers.get('user-agent') || undefined,
      request.headers.get('referer') || undefined,
      ipAddress.split(',')[0].trim()
    ).catch(console.error);

    // Redirect to the original URL
    return NextResponse.redirect(url.originalUrl, {
      status: 301, // Permanent redirect for better SEO
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
