import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

export default config;
