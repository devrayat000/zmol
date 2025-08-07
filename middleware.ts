import { type NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { db, urls } from "@/lib/db";
import { eq } from "drizzle-orm";

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

export async function middleware(request: NextRequest, event: NextFetchEvent) {
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
		fetch(`${request.nextUrl.origin}/api/track/click`, {
			method: "POST",
			body: JSON.stringify({ urlId: url.id }),
			headers: {
				"Content-Type": "application/json",
				...request.headers,
			},
		})
			.then((r) => r.text())
			.catch(console.log);

		// Redirect to the original URL
		return NextResponse.redirect(url.originalUrl, {
			status: 302, // Temporary redirect for better SEO
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
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
