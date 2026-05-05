/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'india.ray-ban.com',
			},
			{
				protocol: 'https',
				hostname: 'images.clothes.com',
			},
		],
	},
};

export default nextConfig;
