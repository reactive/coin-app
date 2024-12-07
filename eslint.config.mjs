import anansiPlugin from '@anansi/eslint-plugin';

export default [
  ...anansiPlugin.configs.typescript,
  {
    ignores: [
      '**/lib*/*',
      '**/dist*/*',
      'packages/*/native/*',
      '**/node_modules*/*',
      'node_modules/*',
      '**/src-*-types/*',
    ],
  },
];
