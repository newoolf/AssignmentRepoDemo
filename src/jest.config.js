// jest.config.js
module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    // Adjust "roots" if needed for your folder structure
    roots: ['<rootDir>/'],
  };