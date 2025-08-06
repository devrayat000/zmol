import { Suspense } from "react";
import { UrlShortenerForm } from "@/components/url-shortener-form";
// import { RecentUrls } from "@/components/recent-urls";
import { StatsCards } from "@/components/stats-cards";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="border-b border-border/50 glass-effect sticky top-0 z-40">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg glow-border">
								<Link2 className="h-6 w-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold gradient-text">Zmol</h1>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="glow-border"
							>
								<a
									href="https://github.com/devrayat000"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="h-4 w-4" />
									<span className="sr-only">GitHub</span>
								</a>
							</Button>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</nav>

			<div className="container mx-auto px-4 py-8 md:py-12">
				{/* Hero Section */}
				<div className="text-center mb-16 space-y-6">
					<div className="space-y-4">
						<h2 className="text-4xl md:text-6xl font-bold tracking-tight">
							Shorten URLs with
							<span className="gradient-text block">Style & Speed</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Transform long URLs into elegant, trackable links instantly.
							Simple, fast, and free URL shortening service.
						</p>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-4xl mx-auto space-y-12">
					{/* URL Shortener Form */}
					<div className="glass-effect-strong rounded-2xl glow-border p-6 md:p-8 card-hover">
						<UrlShortenerForm />
					</div>

					{/* Stats Overview */}
					<div className="space-y-6">
						<h3 className="text-2xl font-semibold flex items-center gap-3">
							<span>Overview</span>
							<div className="h-px flex-1 bg-gradient-to-r from-border via-primary/20 to-transparent" />
						</h3>
						<Suspense fallback={<StatsCardsSkeleton />}>
							<StatsCards />
						</Suspense>
					</div>

					{/* Recent URLs */}
					{/* <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-3">
              <span>Recent URLs</span>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-primary/20 to-transparent" />
            </h3>
            <div className="glass-effect rounded-2xl glow-border p-6 md:p-8 card-hover">
              <Suspense fallback={<RecentUrlsSkeleton />}>
                <RecentUrls />
              </Suspense>
            </div>
          </div> */}
				</div>

				{/* Footer */}
				<footer className="mt-24 text-center">
					<div className="inline-flex items-center gap-2 text-muted-foreground">
						<span>&copy; 2025 Zmol.</span>
						<span>Built with Next.js 15 and</span>
						<span className="text-red-500">❤️</span>
					</div>
				</footer>
			</div>
		</div>
	);
}

function StatsCardsSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="glass-effect rounded-xl glow-border p-6">
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<Skeleton className="w-10 h-10 rounded-lg" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-3 w-24" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

// function RecentUrlsSkeleton() {
// 	return (
// 		<div className="space-y-4">
// 			{Array.from({ length: 5 }).map((_, i) => (
// 				<div
// 					key={i}
// 					className="flex items-center gap-4 p-4 glass-effect rounded-lg glow-border"
// 				>
// 					<div className="flex-1 space-y-2">
// 						<Skeleton className="h-5 w-48" />
// 						<Skeleton className="h-4 w-72" />
// 						<div className="flex items-center gap-4">
// 							<Skeleton className="h-3 w-16" />
// 							<Skeleton className="h-3 w-20" />
// 						</div>
// 					</div>
// 					<div className="flex gap-2">
// 						<Skeleton className="w-8 h-8 rounded" />
// 						<Skeleton className="w-8 h-8 rounded" />
// 					</div>
// 				</div>
// 			))}
// 		</div>
// 	);
// }
