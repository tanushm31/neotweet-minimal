/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"your-supabase-url.supabase.co", // ← change this to match your Supabase project
			"placekitten.com", // Example for test images
		],
		remotePatterns: [{ protocol: "https", hostname: "**" }],
	},
};

export default nextConfig;
