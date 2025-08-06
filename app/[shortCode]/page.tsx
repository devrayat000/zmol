import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ shortCode: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
	const { shortCode } = await params;
	console.log(`Redirecting for short code "${shortCode}"`);

	if (!shortCode) {
		notFound();
	}

	// This page should not be reached as middleware handles redirects
	// If we get here, the URL wasn't found
	// notFound();
	return null;
}
