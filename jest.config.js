module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/example/'],
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/example/'],
};
