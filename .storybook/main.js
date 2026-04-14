const path = require('path');

module.exports = {
  staticDirs: ['../public', '../test/static'],

  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes"
  ],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },

  async viteFinal(config) {
    config.resolve = config.resolve || {};
    // Use array format for aliases to ensure correct resolution order on all platforms
    const customAliases = [
      { find: '@/test', replacement: path.resolve(__dirname, '../test') },
      { find: '@/tailwind', replacement: path.resolve(__dirname, '../tailwind.config.js') },
      { find: /^@\//, replacement: path.resolve(__dirname, '../src') + '/' },
    ];
    if (Array.isArray(config.resolve.alias)) {
      config.resolve.alias = [...customAliases, ...config.resolve.alias];
    } else {
      config.resolve.alias = customAliases;
    }
    return config;
  }
};
