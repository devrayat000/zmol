import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "Zmol - URL Shortener",
    template: "%s | Zmol"
  },
  description: "Transform long URLs into short, memorable links. Track clicks, customize codes, and manage your links with ease.",
  keywords: ["url shortener", "link shortener", "short links", "analytics", "click tracking"],
  authors: [{ name: "Zmol" }],
  creator: "Zmol",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    title: "Zmol - URL Shortener",
    description: "Transform long URLs into short, memorable links. Track clicks, customize codes, and manage your links with ease.",
    siteName: "Zmol",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zmol - URL Shortener",
    description: "Transform long URLs into short, memorable links. Track clicks, customize codes, and manage your links with ease.",
    creator: "@zmol",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
