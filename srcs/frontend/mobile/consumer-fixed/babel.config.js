module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for Privy and crypto libraries
      ['@babel/plugin-transform-private-methods', { loose: true }],
    ],
  };
}; 