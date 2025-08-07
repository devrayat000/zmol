import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Clock, Home } from "lucide-react";

export const metadata: Metadata = {
	title: "URL Expired",
	description: "This short URL has expired and is no longer available.",
	robots: { index: false, follow: false },
};

export default function ExpiredPage() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center space-y-6 max-w-md mx-auto px-4">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4 glow-border">
					<Clock className="h-8 w-8 text-yellow-500" />
				</div>

				<div className="space-y-3">
					<h1 className="text-4xl font-bold gradient-text">Expired</h1>
					<h2 className="text-xl font-semibold text-foreground">
						Short URL Has Expired
					</h2>
					<p className="text-muted-foreground">
						This short URL has expired and is no longer available.
					</p>
				</div>

				<Button
					asChild
					className="glow-border bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
				>
					<Link href="/">
						<Home className="h-4 w-4" />
						Create a New Short URL
					</Link>
				</Button>
			</div>
		</div>
	);
}
