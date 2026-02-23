/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  eslint: {
    // ESLint is run separately in CI via npm run lint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
