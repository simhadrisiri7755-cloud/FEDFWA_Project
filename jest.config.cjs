module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapper: { '\\.(css|less)$': 'identity-obj-proxy' },
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],
};
