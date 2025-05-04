module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)' : 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(' +
        '@react-native|' +
        'react-native|' +
        'react-native-maps|' +
        'react-native-event-listeners|' +
        'react-native-reanimated|' +
        'firebase|' +
        '@firebase|' +
        '@expo/vector-icons|' +
        'expo-font|' +
        'expo-modules-core' +  
        ')/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
};