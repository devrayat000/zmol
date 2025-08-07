import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Zmol - Fast URL Shortener",
		template: "%s | Zmol",
	},
	description:
		"Transform long URLs into short, shareable links instantly. Simple and free URL shortening service.",
	keywords: [
		"url shortener",
		"link shortener",
		"short links",
		"analytics",
		"click tracking",
	],
	authors: [
		{ name: "Zul Ikram Musaddik Rayat", url: "https://github.com/devrayat000" },
	],
	creator: "Zul Ikram Musaddik Rayat <rayathossain49@gmail.com>",
	openGraph: {
		locale: "en_US",
		siteName: "Zmol",
		url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
		title: "Zmol - Fast URL Shortener",
		description: "Transform long URLs into short, shareable links instantly.",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Zmol - Fast URL Shortener",
		description: "Transform long URLs into short, shareable links instantly.",
		creator: "@zul_rayat",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/icon.svg" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="zmol.theme"
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
