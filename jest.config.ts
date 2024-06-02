import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch:  ['<rootDir>/src/**/tests/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/tests/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      statements: 1,
      functions: 1,
      lines: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@errors/(.*)': ['<rootDir>/src/errors/$1'],
    '@auth/(.*)': ['<rootDir>/src/features/auth/$1'],
    '@user/(.*)': ['<rootDir>/src/features/user/$1'],
    '@middlewares/(.*)': ['<rootDir>/src/middlewares/$1'],
    '@queues/(.*)': ['<rootDir>/src/queues/$1'],
    '@services/(.*)': ['<rootDir>/src/services/$1'],
    '@sockets/(.*)': ['<rootDir>/src/sockets/$1'],
    '@utils/(.*)': ['<rootDir>src/utils/$1'],
    '@workers/(.*)': ['<rootDir>/src/workers/$1'],
    '@decorators/(.*)': ['<rootDir>src/decorators/$1'],
    '@root/(.*)' : ['<rootDir>/src/$1']
  }
};

export default config;