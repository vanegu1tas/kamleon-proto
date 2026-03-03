/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../design-system/components/**/*.stories.@(js|jsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
};

export default config;
