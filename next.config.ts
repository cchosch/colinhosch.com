
const nextConfig = {
  // ... other Next.js config options ...
  
  // Use the turbopack key for Turbopack-specific configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js', // Treat the output as a JS module (React component)
      },
    },
  },
};

export default nextConfig;
