module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/ps-helix/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/projects/ps-helix'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^ps-helix$': '<rootDir>/projects/ps-helix/src/public-api.ts',
    '^ps-helix/(.*)$': '<rootDir>/projects/ps-helix/src/$1'
  },
  collectCoverageFrom: [
    'projects/ps-helix/src/**/*.ts',
    '!projects/ps-helix/src/**/*.spec.ts',
    '!projects/ps-helix/src/public-api.ts'
  ],
  coverageDirectory: 'coverage/ps-helix',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/projects/ps-helix/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  }
};
