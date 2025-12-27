/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  webpack(config) {
    // SVGR configuration for importing SVGs as React components
    // Usage: import { ReactComponent as Icon } from './icon.svg'
    // Or: import Icon from './icon.svg' (as component)
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false, // Keep viewBox for scaling
                    },
                  },
                },
                'removeDimensions', // Remove width/height, use viewBox
              ],
            },
            titleProp: true,
            ref: true,
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
