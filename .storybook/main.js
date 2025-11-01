module.exports = {
  staticDirs: ['../public', '../test/static'],

  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-a11y"
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {}
  },

  resolve: {
    fallback: {
      util: require.resolve("util")
    }
  }
};
