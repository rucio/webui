/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  // typescript: {
  //   // Ignore TypeScript errors during production builds
  //   // Story files and test files are type-checked separately
  //   ignoreBuildErrors: true,
  // },
  eslint: {
    // ESLint is run separately in CI/CD
    ignoreDuringBuilds: true,
  },
  // Enable source maps for debugging
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
}

module.exports = nextConfig
