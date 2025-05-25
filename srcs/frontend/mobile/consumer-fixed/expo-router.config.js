/** @type {import('expo-router').ExpoRouterConfig} */
module.exports = {
  // Exclude these directories and files from being treated as routes
  ignore: [
    '**/config/**',
    '**/hooks/**', 
    '**/stores/**',
    '**/utils/**',
    '**/providers/**',
    '**/components/**',
    '**/*.test.*',
    '**/*.spec.*'
  ]
}; 