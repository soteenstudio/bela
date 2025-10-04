import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/units/**/*.test.ts', '**/?(*.)+(spec|test).ts'],

  // hapus globals ts-jest
  // globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },

  // transform sekarang bisa langsung di sini
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!typings/**/*.d.ts'],

  // biar bisa parse ESM di node_modules (contoh chalk)
  transformIgnorePatterns: [
    'node_modules/(?!chalk|ansi-styles)' 
  ],

  // treat TS files as ESM
  extensionsToTreatAsEsm: ['.ts']
};

export default config;