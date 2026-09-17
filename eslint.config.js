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
    languageOptions: {
      parserOptions: {
        // Typed linting, for `no-uncalled-signals`: a signal read without its `()` is the
        // most expensive mistake available in a signals library — it compiles, it renders a
        // function, and nothing else complains.
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Key guardrail for this design system: no `any` in the codebase.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Aliased inputs are the library's own pattern since 7.0.0: a prose default is read
      // through a `computed`, so the input behind it is `xInput` with `alias: 'x'` and the
      // public name is unchanged. (The two older reasons are gone — radio is full-signal and
      // `sidebar.toggle` was renamed in B4.)
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
      // A signal read without its `()` compiles, renders a function, and nothing else
      // complains. This is the rule the typed linting above is paid for.
      '@angular-eslint/no-uncalled-signals': 'error',
      // A signal field is never reassigned; `readonly` says so.
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      // Would have caught scroll.service, which subscribed to the router without one.
      '@angular-eslint/no-implicit-take-until-destroyed': 'error',
      // A published library cannot ship a dependency on an API outside Angular's semver.
      '@angular-eslint/no-developer-preview': 'error',
      '@angular-eslint/no-experimental': 'error',
      // `use-component-view-encapsulation` stays off: the four card components need
      // ViewEncapsulation.None to style projected content, which emulated encapsulation
      // cannot reach — projected content carries the *parent's* attribute. The collision it
      // used to cause is closed by the psh- class namespace, guarded by `verify:classes`.
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
      // Inline test-host components opt into eager change detection so that
      // mutating a plain host field + detectChanges() propagates to the
      // component under test (Angular 22 defaults components to OnPush).
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Errors since B8. They were warnings for a backlog that is empty: every remaining
      // site is waived in place with the reason written next to it — a listbox option whose
      // keyboard lives on the combobox, a backdrop whose keyboard path is Escape. A warning
      // nobody has to clear is a rule that is off.
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      // A `<button>` with no type submits the form around it.
      '@angular-eslint/template/button-has-type': 'error',
      // Literal `style="…"` only: `[style.z-index]` carries a value from the overlay stack
      // and `[style.width]` a configured length — neither can be a class.
      '@angular-eslint/template/no-inline-styles': ['error', { allowBindToStyle: true }],
      // `no-call-expression` stays off. It flags every call in a template, and in a signals
      // library that is every input read and every event handler — 659 of them here, of
      // which the 47 worth knowing about would be invisible in the noise. The cost of a
      // method call in a binding is real; a rule that cannot tell it from `value()` is not
      // how to find it.
    },
  },
);
