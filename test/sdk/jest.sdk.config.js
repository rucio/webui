const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  displayName: 'sdk',
  rootDir: '../../',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/test/sdk/jest.sdk.setup.ts'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
  // you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
  // The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
  // For example:
  moduleNameMapper: {
    '^@/lib/infrastructure/auth/auth$': '<rootDir>/test/__mocks__/auth.ts',
    '@/(.*)$': '<rootDir>/src/$1',
    '^next-auth/providers/credentials$': '<rootDir>/test/gateway/__mocks__/next-auth-providers-credentials.js',
    '^next-auth$': '<rootDir>/test/gateway/__mocks__/next-auth.js',
    '^next-auth/(.*)$': '<rootDir>/test/gateway/__mocks__/next-auth.js',
    '^@auth/core/providers/credentials$': '<rootDir>/test/gateway/__mocks__/next-auth-providers-credentials.js',
    '^@auth/core$': '<rootDir>/test/gateway/__mocks__/auth-core.js',
    '^@auth/core/(.*)$': '<rootDir>/test/gateway/__mocks__/auth-core.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/test/sdk/**/*.test.ts', '<rootDir>/test/sdk/**/*.test.tsx'],

}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
