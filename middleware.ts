import { NextRequest, NextResponse } from 'next/server';
import { getUrlByShortCode, trackClick } from '@/lib/actions';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for specific paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/stats') ||
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
    const url = await getUrlByShortCode(shortCode);
    
    if (!url) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      return NextResponse.redirect(new URL('/expired', request.url));
    }

    // Track the click asynchronously (don't await to avoid blocking redirect)
    trackClick(
      url.id,
      request.headers.get('user-agent') || undefined,
      request.headers.get('referer') || undefined
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
     * - stats (analytics pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|stats).*)',
  ],
};
