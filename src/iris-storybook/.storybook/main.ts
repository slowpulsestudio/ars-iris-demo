import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const irisShell = fileURLToPath(new URL('../../iris-shell', import.meta.url));
const srcRoot = fileURLToPath(new URL('../..', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  staticDirs: [`${irisShell}/public`],
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import('vite');
    return mergeConfig(viteConfig, {
      resolve: {
        alias: { '@iris': `${irisShell}/src` },
        dedupe: ['react', 'react-dom'],
      },
      server: { fs: { allow: [srcRoot] } },
    });
  },
};

export default config;
