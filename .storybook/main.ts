import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "storybook-dark-mode",
    "storybook-next-intl",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  webpackFinal: async (config) => {
    return config;
  },

  features: {
    experimentalRSC: true,
  },
};
export default config;
