const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for @ alias
config.resolver.alias = {
  '@': __dirname,
};

module.exports = config; 