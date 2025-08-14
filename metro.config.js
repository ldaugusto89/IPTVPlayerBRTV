const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
    extraNodeModules: {
      // Quando algo no código pedir 'timers', o Metro vai fornecer a biblioteca 'timers-browserify'
      timers: require.resolve('timers-browserify'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
