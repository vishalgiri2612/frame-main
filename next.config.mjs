/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'india.ray-ban.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'images.clothes.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'image.pollinations.ai',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'pollinations.ai',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				pathname: '**',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
					},
				],
			},
		];
	},
	poweredByHeader: false,
};

export default nextConfig;
