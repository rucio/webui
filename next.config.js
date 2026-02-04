/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  // typescript: {
  //   // Ignore TypeScript errors during production builds
  //   // Story files and test files are type-checked separately
  //   ignoreBuildErrors: true,
  // },
  // Note: eslint config removed - no longer supported in Next.js 16
  // ESLint is run separately in CI/CD via npm run lint

  // Turbopack configuration (empty config silences webpack/turbopack warning)
  // Turbopack is the default bundler in Next.js 16
  turbopack: {},

  // Keep webpack config for production builds or when explicitly using webpack
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
}

module.exports = nextConfig
