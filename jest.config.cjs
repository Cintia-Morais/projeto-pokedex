module.exports = {
  testEnvironment: 'jsdom',
  transform: {

    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
   
    '^@/(.*)$': '<rootDir>/src/$1',

    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/main.jsx', 
    '!src/App.jsx', 
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/context/**', 
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', 
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.(js|jsx)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};