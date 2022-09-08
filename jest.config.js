module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  testPathIgnorePatterns: ['fixtures'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/config',
    'src/app.js',
    'tests',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  autoRun: 'false',
};
