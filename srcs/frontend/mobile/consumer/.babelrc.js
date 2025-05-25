// File: srcs/frontend/mobile/consumer/.babelrc.js
module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // Handle ESM imports
        ['@babel/plugin-transform-modules-commonjs', {
          allowTopLevelThis: true,
          loose: true,
          lazy: true
        }]
      ],
    };
  };