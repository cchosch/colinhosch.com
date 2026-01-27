import { NextConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    // ... other Next.js config options ...
    webpack(config, ctx) {
        console.log(config);
        console.log(ctx);
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find(
            (rule: {test?: RegExp}) => rule.test?.test?.('.svg')
        );

        // Reapply the existing rule, but only for svg imports ending in ?url
        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer ?? /\.[jt]sx?$/,
                resourceQuery: {
                // keep any existing exclusions and add `?url`
                not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/],
                },
                use: ['@svgr/webpack'],
            }
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
    
    // Use the turbopack key for Turbopack-specific configuration
    turbopack: {
        rules: {
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                        options: {icon: true},
                    }
                ],
                as: '*.js', // Treat the output as a JS module (React component)
            },
        },
    }
};

export default nextConfig;
