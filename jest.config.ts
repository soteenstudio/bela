import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!typings/**/*.d.ts']
};
export default config;