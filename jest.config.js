module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@reduxjs/toolkit|redux|redux-thunk|immer|reselect))",
    "/node_modules/react-native-reanimated/plugin/",
  ],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  collectCoverageFrom: [
    "features/**/*.{ts,tsx}",
    "store/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/components/styles.ts",
  ],
};
