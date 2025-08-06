import { customAlphabet } from "nanoid";
import { url } from "zod/mini";

// Generate short codes using alphanumeric characters
const alphabet =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateShortCode = customAlphabet(alphabet, 7);

export { generateShortCode };

export function isValidUrl(string: string) {
	try {
		url().parse(string);
		return true;
	} catch {
		return false;
	}
}

export function formatUrl(url: string) {
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		return `https://${url}`;
	}
	return url;
}

export function extractDomain(url: string) {
	try {
		return new URL(url).hostname;
	} catch {
		return null;
	}
}

export function truncateText(text: string, maxLength: number) {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}
