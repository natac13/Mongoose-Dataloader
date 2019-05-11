// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  transform: {
    '^.+\\.(js|ts)?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)?$',
  moduleFileExtensions: ['js'],
  testPathIgnorePatterns: ['/node_modules/', './lib', './scripts'],
  // A preset that is used as a base for Jest's configuration
  preset: '@shelf/jest-mongodb',

  // The test environment that will be used for testing
  // testEnvironment: 'node',
};
