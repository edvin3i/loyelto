const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Add specific resolver for crypto modules
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Handle crypto module warnings
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Disable cache stores temporarily to fix the error
config.cacheStores = undefined;

module.exports = config; 