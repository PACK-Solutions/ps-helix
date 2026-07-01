// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.angular/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Key guardrail for this design system: no `any` in the codebase.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Intentional patterns in this library:
      // - aliased inputs back a plain signal (CVA decoupling, see radio),
      // - the `toggle` output is part of the public sidebar API (cannot rename).
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'psh', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'psh', style: 'kebab-case' },
      ],
    },
  },
  {
    // Test files may use `any` and helper casts; relax the production guardrails.
    files: ['**/*.spec.ts', '**/setup-jest.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Test host components use plain selectors.
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Known a11y backlog: several clickable elements need keyboard handlers /
      // focus support. Tracked as warnings (see the Accessibility statement) so
      // they are visible without blocking CI while they are addressed.
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
    },
  },
);
