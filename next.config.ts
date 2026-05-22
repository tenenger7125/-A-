import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['msw', '@mswjs/interceptors'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
