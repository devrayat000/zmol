import { CACHE_TAGS } from "@/lib/cache";
import { db, urlClicks } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
	const { urlId } = await request.json();
	console.log(`Tracking click for URL ID: ${urlId}`);

	try {
		const headersList = request.headers;
		const ipAddress =
			headersList.get("x-forwarded-for") ||
			headersList.get("x-real-ip") ||
			"unknown";
		const referer = headersList.get("referer");
		const userAgent = headersList.get("user-agent");

		await db.insert(urlClicks).values({
			urlId,
			userAgent: userAgent,
			referer: referer,
			ipAddress: ipAddress.split(",")[0].trim(),
		});

		// Invalidate click-related caches
		revalidateTag(CACHE_TAGS.CLICKS);
		revalidateTag(CACHE_TAGS.URLS);

		return new Response("Click tracked successfully", {
			status: 200,
		});
	} catch (error) {
		console.error("Error tracking click:", error);

		return new Response("Failed to track click", {
			status: 500,
		});
	}
}
