module.exports = {
  preset: "jest-expo",
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*))",
  ],
  moduleNameMapper: {
    "^expo/src/winter/runtime.native.ts$": "<rootDir>/__mocks__/expo-mock.js"
  },
};