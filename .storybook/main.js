module.exports = {
  staticDirs: ['../public'],

  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode"
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {}
  },

  resolve: {
    fallback: {
      util: require.resolve("util")
    }
  },

  docs: {
    autodocs: true
  }
};
