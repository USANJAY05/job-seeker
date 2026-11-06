module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-safe-area-context|react-native-url-polyfill|react-native-paper|@react-navigation|react-native-vector-icons)/)'],
};
