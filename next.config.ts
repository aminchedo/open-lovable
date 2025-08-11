/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['e2b', '@mendable/firecrawl-js'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('e2b', '@mendable/firecrawl-js');
    }
    return config;
  },
  env: {
    E2B_API_KEY: process.env.E2B_API_KEY,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    AVALAI_API_KEY: process.env.AVALAI_API_KEY,
    AVALAI_BASE_URL: process.env.AVALAI_BASE_URL,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }
};

module.exports = nextConfig;
