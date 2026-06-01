/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', {}] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  watchPathIgnorePatterns: ['<rootDir>/.next/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};
