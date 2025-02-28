/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "res.cloudinary.com"
			},
			{
				hostname: "picsum.photos"
			}
		]
	}
};

export default nextConfig;
