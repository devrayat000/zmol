"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db, urls, urlClicks, insertUrlSchema } from "@/lib/db";
import { generateShortCode, formatUrl, isValidUrl } from "@/lib/url-utils";
import {
	getCachedUrlByShortCode,
	getCachedRecentUrls,
	CACHE_TAGS,
} from "@/lib/cache";

export type ActionResult = {
	success: boolean;
	message: string;
	data?: {
		shortCode?: string;
		existing?: boolean;
	};
};

export async function createShortUrl(
	formData: FormData,
): Promise<ActionResult> {
	try {
		const originalUrl = formData.get("originalUrl") as string;

		if (!originalUrl) {
			return { success: false, message: "URL is required" };
		}

		const formattedUrl = formatUrl(originalUrl);

		if (!isValidUrl(formattedUrl)) {
			return { success: false, message: "Please enter a valid URL" };
		}

		// Check if URL already exists
		const existingUrl = await db
			.select()
			.from(urls)
			.where(eq(urls.originalUrl, formattedUrl))
			.limit(1);
		if (existingUrl.length > 0) {
			return {
				success: true,
				message: "URL already exists",
				data: { shortCode: existingUrl[0].shortCode, existing: true },
			};
		}

		// Generate unique short code
		let shortCode: string;
		do {
			shortCode = generateShortCode();
			const existing = await db
				.select()
				.from(urls)
				.where(eq(urls.shortCode, shortCode))
				.limit(1);
			if (existing.length === 0) break;
		} while (true);

		// Get page title
		let pageTitle = "";
		try {
			const response = await fetch(formattedUrl, {
				method: "GET",
				headers: { "User-Agent": "Mozilla/5.0 (compatible; URLShortener/1.0)" },
			});
			const html = await response.text();
			const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
			pageTitle = titleMatch ? titleMatch[1].trim() : "";
		} catch {
			// If we can't fetch the title, that's okay
		}

		const insertData = {
			originalUrl: formattedUrl,
			shortCode: shortCode,
			title: pageTitle || null,
			description: null,
			isCustom: false,
		};

		const result = insertUrlSchema.safeParse(insertData);
		if (!result.success) {
			return { success: false, message: "Invalid data provided" };
		}

		await db.insert(urls).values(insertData);

		// Invalidate relevant caches
		revalidateTag(CACHE_TAGS.URLS);
		revalidateTag(CACHE_TAGS.RECENT);
		revalidatePath("/");

		return {
			success: true,
			message: "Short URL created successfully!",
			data: { shortCode: shortCode, existing: false },
		};
	} catch (error) {
		console.error("Error creating short URL:", error);
		return { success: false, message: "Failed to create short URL" };
	}
}

export const getUrlByShortCode = getCachedUrlByShortCode;

export async function trackClick(
	urlId: number,
	userAgent?: string,
	referer?: string,
) {
	try {
		const headersList = await headers();
		const ipAddress =
			headersList.get("x-forwarded-for") ||
			headersList.get("x-real-ip") ||
			"unknown";

		await Promise.all([
			db.insert(urlClicks).values({
				urlId,
				userAgent: userAgent || null,
				referer: referer || null,
				ipAddress: ipAddress.split(",")[0].trim(),
			}),
			db
				.update(urls)
				.set({
					clicks: sql`${urls.clicks} + 1`,
					updatedAt: new Date(),
				})
				.where(eq(urls.id, urlId)),
		]);

		// Invalidate click-related caches
		revalidateTag(CACHE_TAGS.CLICKS);
		revalidateTag(CACHE_TAGS.URLS);
	} catch (error) {
		console.error("Error tracking click:", error);
	}
}

export async function redirectToUrl(shortCode: string) {
	const url = await getUrlByShortCode(shortCode);

	if (!url) {
		redirect("/404");
	}

	if (url.expiresAt && new Date() > url.expiresAt) {
		redirect("/expired");
	}

	// Track the click in the background
	trackClick(url.id).catch(console.error);

	redirect(url.originalUrl);
}

export const getRecentUrls = getCachedRecentUrls;
