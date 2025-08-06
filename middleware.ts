import { type NextRequest, NextResponse } from "next/server";
import { db, urls, urlClicks } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

// Simple URL lookup without caching for middleware
async function getUrlByShortCode(shortCode: string) {
	try {
		const result = await db
			.select()
			.from(urls)
			.where(eq(urls.shortCode, shortCode))
			.limit(1);
		return result[0] || null;
	} catch (error) {
		console.error("Error fetching URL in middleware:", error);
		return null;
	}
}

// Simplified click tracking for middleware
async function trackClickInMiddleware(
	urlId: number,
	userAgent?: string,
	referer?: string,
	ip?: string,
) {
	try {
		await Promise.all([
			db.insert(urlClicks).values({
				urlId,
				userAgent: userAgent || null,
				referer: referer || null,
				ipAddress: ip || "unknown",
			}),
			db
				.update(urls)
				.set({
					clicks: sql`${urls.clicks} + 1`,
					updatedAt: new Date(),
				})
				.where(eq(urls.id, urlId)),
		]);

		// Note: revalidateTag might not work properly in Edge Runtime
		// We'll handle cache invalidation in the server action instead
	} catch (error) {
		console.error("Error tracking click in middleware:", error);
	}
}

export async function middleware(request: NextRequest) {
	console.log(`Middleware triggered for path: ${request.url}`);

	const pathname = request.nextUrl.pathname;

	// Skip middleware for specific paths
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/" ||
		pathname === "/expired" ||
		pathname === "/not-found" ||
		pathname === "/404" ||
		pathname.startsWith("/favicon") ||
		pathname.includes(".")
	) {
		console.log(`Skipping middleware for path: ${pathname}`);
		return NextResponse.next();
	}

	// Extract short code from pathname
	const shortCode = pathname.slice(1);
	console.log(`Short code extracted from path: "${shortCode}"`);

	if (!shortCode) {
		return NextResponse.next();
	}

	try {
		// Get URL data from database
		const url = await getUrlByShortCode(shortCode);
		console.log(`Fetching URL for short code "${shortCode}" in middleware`);

		if (!url) {
			console.log(`Short code "${shortCode}" not found in database`);
			return NextResponse.redirect(new URL("/not-found", request.url));
		}

		console.log(`Found URL for short code "${shortCode}": ${url.originalUrl}`);

		// Check if URL has expired
		if (url.expiresAt && new Date() > url.expiresAt) {
			return NextResponse.redirect(new URL("/expired", request.url));
		}

		// Track the click asynchronously (don't await to avoid blocking redirect)
		const ipAddress =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";
		trackClickInMiddleware(
			url.id,
			request.headers.get("user-agent") || undefined,
			request.headers.get("referer") || undefined,
			ipAddress.split(",")[0].trim(),
		).catch(console.error);

		// Redirect to the original URL
		return NextResponse.redirect(url.originalUrl, {
			status: 301, // Permanent redirect for better SEO
			headers: {
				"Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/not-found", request.url));
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
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
