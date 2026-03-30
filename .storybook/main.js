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
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/test': path.resolve(__dirname, '../test'),
      '@/tailwind': path.resolve(__dirname, '../tailwind.config.js'),
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  }
};
