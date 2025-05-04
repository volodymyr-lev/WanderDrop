module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-env', '@babel/preset-react', 'module:metro-react-native-babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      ["@babel/plugin-transform-private-methods", { "loose": true }],
      ["@babel/plugin-transform-private-property-in-object", { "loose": true }],
      ["@babel/plugin-transform-class-properties", { "loose": true }]  
    ],
  };
};