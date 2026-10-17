// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>/.kilo/', '<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
  coverageThreshold: {
    './lib/leads.ts': { statements: 80, branches: 45, functions: 100, lines: 85 },
    './lib/http.ts': { statements: 80, branches: 55, functions: 100, lines: 85 },
    './lib/submission-key.ts': { statements: 90, branches: 70, functions: 100, lines: 90 },
    './lib/submit-enquiry.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!lib/**/*.test.ts',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
