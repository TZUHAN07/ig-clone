module.exports = {
  testEnvironment: "node",

  testMatch: ["**/test/**/*.test.js"],

  testTimeout: 30000,

  setupFilesAfterEach: ["./test/setup.js"],

  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "config/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
  ],

  coverageReporters: ["text", "html", "lcov"],

  verbose: true,
};
