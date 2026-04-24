/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: {
        root: __dirname,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'ui-avatars.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
    },
    async rewrites() {
        const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
            .replace(/\/api$/, '');
        return [
            {
                // Proxy /api/* to backend EXCEPT /api/auth/* which NextAuth handles internally
                source: '/api/:path((?!auth).*)',
                destination: `${backendBase}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
