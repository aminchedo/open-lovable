/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Essential for Vercel deployment
  output: 'standalone',

  // ✅ Production optimizations
  compress: true,
  poweredByHeader: false,

  // ✅ Build error handling for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Advanced configurations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  serverExternalPackages: ['@e2b/code-interpreter', '@e2b/sdk'],
  
  // ✅ Expose safe environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AVALAI_BASE_URL: process.env.AVALAI_BASE_URL,
  },

  // ✅ Improved webpack configuration for Vercel
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Client-side fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        assert: false,
        process: false,
        buffer: false,
      }
    }

    // Handle external packages that shouldn't be bundled
    config.externals = [...(config.externals || []), 'canvas', 'jsdom', 'sharp']

    // Optimize for Vercel's environment
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }

    // Add alias for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd(),
    }

    return config
  },

  // ✅ Image optimization for Vercel
  images: {
    domains: ['firecrawl.dev'],
    formats: ['image/webp', 'image/avif'],
  },

  // ✅ Headers for better performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
