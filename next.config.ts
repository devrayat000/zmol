import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// experimental: {
	//   // Enable experimental features for better performance
	//   ppr: true, // Partial Pre-rendering
	// },

	// Compress responses
	compress: true,

	// Optimize images
	images: {
		formats: ["image/webp", "image/avif"],
		minimumCacheTTL: 3600,
	},

	compiler: { removeConsole: process.env.NODE_ENV === "production" },

	// Bundle optimization
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Optimize client-side bundle
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			};
		}
		return config;
	},
};

export default nextConfig;
