import parserVue from 'vue-eslint-parser';

import js from '@eslint/js';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginTurbo from 'eslint-config-turbo';
import createCommand from 'eslint-plugin-command/config';
import pluginComments from 'eslint-plugin-eslint-comments';
import * as pluginImport from 'eslint-plugin-import-x';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginNode from 'eslint-plugin-n';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginRegexp from 'eslint-plugin-regexp';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginTest from 'eslint-plugin-vitest';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import parserJsonc from 'jsonc-eslint-parser';

const restrictedImportIgnores = [
  '**/vite.config.mts',
  '**/tailwind.config.mjs',
  '**/postcss.config.mjs',
];

const sortPackageJson = () => {
  return {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-array-values': [
        'error',
        {
          order: { type: 'asc' },
          pathPattern: '^files$|^pnpm.neverBuiltDependencies$',
        },
      ],
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'name',
            'version',
            'description',
            'private',
            'keywords',
            'homepage',
            'bugs',
            'repository',
            'license',
            'author',
            'contributors',
            'categories',
            'funding',
            'type',
            'scripts',
            'files',
            'sideEffects',
            'bin',
            'main',
            'module',
            'unpkg',
            'jsdelivr',
            'types',
            'typesVersions',
            'imports',
            'exports',
            'publishConfig',
            'icon',
            'activationEvents',
            'contributes',
            'peerDependencies',
            'peerDependenciesMeta',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'engines',
            'packageManager',
            'pnpm',
            'overrides',
            'resolutions',
            'husky',
            'simple-git-hooks',
            'lint-staged',
            'eslintConfig',
          ],
          pathPattern: '^$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
        },
        {
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$',
        },
      ],
    },
  };
};

const sortTsconfig = () => {
  return {
    files: [
      '**/tsconfig.json',
      '**/tsconfig.*.json',
      'internal/tsconfig/*.json',
    ],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'extends',
            'compilerOptions',
            'references',
            'files',
            'include',
            'exclude',
          ],
          pathPattern: '^$',
        },
        {
          order: [
            /* Projects */
            'incremental',
            'composite',
            'tsBuildInfoFile',
            'disableSourceOfProjectReferenceRedirect',
            'disableSolutionSearching',
            'disableReferencedProjectLoad',
            /* Language and Environment */
            'target',
            'jsx',
            'jsxFactory',
            'jsxFragmentFactory',
            'jsxImportSource',
            'lib',
            'moduleDetection',
            'noLib',
            'reactNamespace',
            'useDefineForClassFields',
            'emitDecoratorMetadata',
            'experimentalDecorators',
            /* Modules */
            'baseUrl',
            'rootDir',
            'rootDirs',
            'customConditions',
            'module',
            'moduleResolution',
            'moduleSuffixes',
            'noResolve',
            'paths',
            'resolveJsonModule',
            'resolvePackageJsonExports',
            'resolvePackageJsonImports',
            'typeRoots',
            'types',
            'allowArbitraryExtensions',
            'allowImportingTsExtensions',
            'allowUmdGlobalAccess',
            /* JavaScript Support */
            'allowJs',
            'checkJs',
            'maxNodeModuleJsDepth',
            /* Type Checking */
            'strict',
            'strictBindCallApply',
            'strictFunctionTypes',
            'strictNullChecks',
            'strictPropertyInitialization',
            'allowUnreachableCode',
            'allowUnusedLabels',
            'alwaysStrict',
            'exactOptionalPropertyTypes',
            'noFallthroughCasesInSwitch',
            'noImplicitAny',
            'noImplicitOverride',
            'noImplicitReturns',
            'noImplicitThis',
            'noPropertyAccessFromIndexSignature',
            'noUncheckedIndexedAccess',
            'noUnusedLocals',
            'noUnusedParameters',
            'useUnknownInCatchVariables',
            /* Emit */
            'declaration',
            'declarationDir',
            'declarationMap',
            'downlevelIteration',
            'emitBOM',
            'emitDeclarationOnly',
            'importHelpers',
            'importsNotUsedAsValues',
            'inlineSourceMap',
            'inlineSources',
            'mapRoot',
            'newLine',
            'noEmit',
            'noEmitHelpers',
            'noEmitOnError',
            'outDir',
            'outFile',
            'preserveConstEnums',
            'preserveValueImports',
            'removeComments',
            'sourceMap',
            'sourceRoot',
            'stripInternal',
            /* Interop Constraints */
            'allowSyntheticDefaultImports',
            'esModuleInterop',
            'forceConsistentCasingInFileNames',
            'isolatedModules',
            'preserveSymlinks',
            'verbatimModuleSyntax',
            /* Completeness */
            'skipDefaultLibCheck',
            'skipLibCheck',
          ],
          pathPattern: '^compilerOptions$',
        },
      ],
    },
  };
};

export default defineConfig([
  // vue rule
  {
    files: ['**/*.vue'],
    languageOptions: {
      // globals: {
      //   computed: 'readonly',
      //   defineEmits: 'readonly',
      //   defineExpose: 'readonly',
      //   defineProps: 'readonly',
      //   onMounted: 'readonly',
      //   onUnmounted: 'readonly',
      //   reactive: 'readonly',
      //   ref: 'readonly',
      //   shallowReactive: 'readonly',
      //   shallowRef: 'readonly',
      //   toRef: 'readonly',
      //   toRefs: 'readonly',
      //   watch: 'readonly',
      //   watchEffect: 'readonly',
      // },
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        parser: parserTs,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs['vue3-essential'].rules,
      ...pluginVue.configs['vue3-strongly-recommended'].rules,
      ...pluginVue.configs['vue3-recommended'].rules,

      'vue/attribute-hyphenation': [
        'error',
        'always',
        {
          ignore: [],
        },
      ],
      'vue/attributes-order': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],
      'vue/dot-location': ['error', 'property'],
      'vue/dot-notation': ['error', { allowKeywords: true }],
      'vue/eqeqeq': ['error', 'smart'],
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-indent': 'off',
      // 'vue/html-indent': ['error', 2],
      'vue/html-quotes': ['error', 'double'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            component: 'always',
            normal: 'never',
            void: 'always',
          },
          math: 'always',
          svg: 'always',
        },
      ],
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/no-empty-pattern': 'error',
      'vue/no-extra-parens': ['error', 'functions'],
      'vue/no-irregular-whitespace': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-reserved-component-names': 'off',
      'vue/no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'vue/no-restricted-v-bind': ['error', '/^v-/'],
      'vue/no-sparse-arrays': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
          ignoreConstructors: false,
        },
      ],
      'vue/one-component-per-file': 'error',
      'vue/prefer-import-from-vue': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-template': 'error',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/require-prop-types': 'off',
      'vue/script-setup-uses-vars': 'error',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/space-infix-ops': 'error',
      'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
          ignore: [],
        },
      ],
    },
  },

  // javascript rule
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      'accessor-pairs': [
        'error',
        { enforceForClassMembers: true, setWithoutGet: true },
      ],
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'constructor-super': 'error',
      'default-case-last': 'error',
      'dot-notation': ['error', { allowKeywords: true }],
      eqeqeq: ['error', 'always'],
      'keyword-spacing': 'off',

      'new-cap': [
        'error',
        { capIsNew: false, newIsCap: true, properties: true },
      ],
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-async-promise-executor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-const-assign': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-character-class': 'error',
      'no-empty-function': 'off',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-import-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-regex-spaces': 'error',
      'no-restricted-globals': [
        'error',
        { message: 'Use `globalThis` instead.', name: 'global' },
        { message: 'Use `globalThis` instead.', name: 'self' },
      ],
      'no-restricted-properties': [
        'error',
        {
          message:
            'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
          property: '__proto__',
        },
        {
          message: 'Use `Object.defineProperty` instead.',
          property: '__defineGetter__',
        },
        {
          message: 'Use `Object.defineProperty` instead.',
          property: '__defineSetter__',
        },
        {
          message: 'Use `Object.getOwnPropertyDescriptor` instead.',
          property: '__lookupGetter__',
        },
        {
          message: 'Use `Object.getOwnPropertyDescriptor` instead.',
          property: '__lookupSetter__',
        },
      ],
      'no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement',
        'TSEnumDeclaration[const=true]',
        'TSExportAssignment',
      ],
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'off',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
      'no-use-before-define': [
        'error',
        { classes: false, functions: false, variables: false },
      ],
      'no-useless-backreference': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-with': 'error',
      'object-shorthand': [
        'error',
        'always',
        { avoidQuotes: true, ignoreConstructors: false },
      ],
      'one-var': ['error', { initialized: 'never' }],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      'prefer-exponentiation-operator': 'error',

      'prefer-promise-reject-errors': 'off',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'space-before-function-paren': 'off',
      'spaced-comment': 'error',
      'symbol-description': 'error',
      'unicode-bom': ['error', 'never'],

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'use-isnan': [
        'error',
        { enforceForIndexOf: true, enforceForSwitchCase: true },
      ],
      'valid-typeof': ['error', { requireStringLiterals: true }],

      'vars-on-top': 'error',
      yoda: ['error', 'never'],
    },
  },

  // ignores rule
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/dist-*',
      '**/*-dist',
      '**/.husky',
      '**/.nitro',
      '**/.output',
      '**/Dockerfile',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/bun.lockb',
      '**/output',
      '**/coverage',
      '**/temp',
      '**/.temp',
      '**/tmp',
      '**/.tmp',
      '**/.history',
      '**/.turbo',
      '**/.nuxt',
      '**/.next',
      '**/.vercel',
      '**/.changeset',
      '**/.idea',
      '**/.cache',
      '**/.output',
      '**/.vite-inspect',

      '**/CHANGELOG*.md',
      '**/*.min.*',
      '**/LICENSE*',
      '**/__snapshots__',
      '**/*.snap',
      '**/fixtures/**',
      '**/.vitepress/cache/**',
      '**/auto-import?(s).d.ts',
      '**/components.d.ts',
      '**/vite.config.mts.*',
      '**/*.sh',
      '**/*.ttf',
      '**/*.woff',
    ],
  },

  // prettier rule
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // typescript rule
  {
    files: ['**/*.?([cm])[jt]s?(x)'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        createDefaultProgram: false,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        jsxPragma: 'React',
        project: './tsconfig.*.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...pluginTs.configs['eslint-recommended'].overrides?.[0].rules,
      ...pluginTs.configs.strict.rules,
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
        },
      ],
      // '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/consistent-type-definitions': 'off',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      'unused-imports/no-unused-vars': 'off',
    },
  },

  // jsonc rule
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc', '*.code-workspace'],
    languageOptions: {
      parser: parserJsonc,
    },
    plugins: {
      jsonc: pluginJsonc,
    },
    rules: {
      'jsonc/no-bigint-literals': 'error',
      'jsonc/no-binary-expression': 'error',
      'jsonc/no-binary-numeric-literals': 'error',
      'jsonc/no-dupe-keys': 'error',
      'jsonc/no-escape-sequence-in-identifier': 'error',
      'jsonc/no-floating-decimal': 'error',
      'jsonc/no-hexadecimal-numeric-literals': 'error',
      'jsonc/no-infinity': 'error',
      'jsonc/no-multi-str': 'error',
      'jsonc/no-nan': 'error',
      'jsonc/no-number-props': 'error',
      'jsonc/no-numeric-separators': 'error',
      'jsonc/no-octal': 'error',
      'jsonc/no-octal-escape': 'error',
      'jsonc/no-octal-numeric-literals': 'error',
      'jsonc/no-parenthesized': 'error',
      'jsonc/no-plus-sign': 'error',
      'jsonc/no-regexp-literals': 'error',
      'jsonc/no-sparse-arrays': 'error',
      'jsonc/no-template-literals': 'error',
      'jsonc/no-undefined-value': 'error',
      'jsonc/no-unicode-codepoint-escapes': 'error',
      'jsonc/no-useless-escape': 'error',
      'jsonc/space-unary-ops': 'error',
      'jsonc/valid-json-number': 'error',
      'jsonc/vue-custom-block/no-parsing-error': 'error',
    },
  },
  sortTsconfig(),
  sortPackageJson(),

  // disables
  {
    files: ['**/__tests__/**/*.?([cm])[jt]s?(x)'],
    name: 'disables/test',
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'disables/dts',
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    name: 'disables/js',
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // import rule
  {
    plugins: {
      // @ts-expect-error - This is a dynamic import
      import: pluginImport,
    },
    rules: {
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'off',
      'import/no-webpack-loader-syntax': 'error',
    },
  },

  // node rule
  {
    plugins: {
      n: pluginNode,
    },
    rules: {
      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: [
            'unbuild',
            '@vben/vite-config',
            'vitest',
            'vite',
            '@vue/test-utils',
            '@vben/tailwind-config',
            '@playwright/test',
          ],
        },
      ],
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      // 'n/no-unpublished-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        {
          ignores: [],
          version: '>=18.0.0',
        },
      ],
      'n/prefer-global/buffer': ['error', 'never'],
      // 'n/no-missing-import': 'off',
      'n/prefer-global/process': ['error', 'never'],
      'n/process-exit-as-throw': 'error',
    },
  },
  {
    files: ['scripts/**/*.?([cm])[jt]s?(x)', 'internal/**/*.?([cm])[jt]s?(x)'],
    rules: {
      'n/prefer-global/process': 'off',
    },
  },

  // perfectionist rule
  perfectionistPlugin.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-exports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            type: {
              'vben-core-type': ['^@vben-core/.+'],
              'vben-type': ['^@vben/.+'],
              'vue-type': ['^vue$', '^vue-.+', '^@vue/.+'],
            },
            value: {
              vben: ['^@vben/.+'],
              'vben-core': ['^@vben-core/.+'],
              vue: ['^vue$', '^vue-.+', '^@vue/.+'],
            },
          },
          environment: 'node',
          groups: [
            ['external-type', 'builtin-type', 'type'],
            'vue-type',
            'vben-type',
            'vben-core-type',
            ['parent-type', 'sibling-type', 'index-type'],
            ['internal-type'],
            'builtin',
            'vue',
            'vben',
            'vben-core',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'side-effect-style',
            'style',
            'object',
            'unknown',
          ],
          internalPattern: ['^#/.+'],
          newlinesBetween: 'always',
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-exports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: {
            items: 'items',
            list: 'list',
            children: 'children',
          },
          groups: ['unknown', 'items', 'list', 'children'],
          ignorePattern: ['children'],
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  },

  // comments rule
  {
    plugins: {
      'eslint-comments': pluginComments,
    },
    rules: {
      'eslint-comments/no-aggregating-enable': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-enable': 'error',
    },
  },

  // jsdoc rule
  {
    plugins: {
      jsdoc: pluginJsdoc,
    },
    rules: {
      'jsdoc/check-access': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-property-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/empty-tags': 'warn',
      'jsdoc/implements-on-classes': 'warn',
      'jsdoc/no-defaults': 'warn',
      'jsdoc/no-multi-asterisks': 'warn',
      'jsdoc/require-param-name': 'warn',
      'jsdoc/require-property': 'warn',
      'jsdoc/require-property-description': 'warn',
      'jsdoc/require-property-name': 'warn',
      'jsdoc/require-returns-check': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-yields-check': 'warn',
    },
  },

  // unicorn rule
  {
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      ...pluginUnicorn.configs.recommended.rules,

      'unicorn/better-regex': 'off',
      'unicorn/consistent-destructuring': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-promise-resolve-reject': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['scripts/**/*.?([cm])[jt]s?(x)', 'internal/**/*.?([cm])[jt]s?(x)'],
    rules: {
      'unicorn/no-process-exit': 'off',
    },
  },

  // test rule
  {
    files: [
      `**/__tests__/**/*.?([cm])[jt]s?(x)`,
      `**/*.spec.?([cm])[jt]s?(x)`,
      `**/*.test.?([cm])[jt]s?(x)`,
      `**/*.bench.?([cm])[jt]s?(x)`,
      `**/*.benchmark.?([cm])[jt]s?(x)`,
    ],
    plugins: {
      test: {
        ...pluginTest,
        rules: {
          ...pluginTest.rules,
          ...pluginNoOnlyTests.rules,
        },
      },
    },
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      'test/no-identical-title': 'error',
      'test/no-import-node-test': 'error',
      'test/no-only-tests': 'error',
      'test/prefer-hooks-in-order': 'error',
      'test/prefer-lowercase-title': 'error',
    },
  },

  // regexp rule
  {
    plugins: {
      regexp: pluginRegexp,
    },
    rules: {
      ...pluginRegexp.configs.recommended.rules,
    },
  },

  // command rule
  {
    // @ts-expect-error - no types
    ...createCommand(),
  },

  // turbo rule
  {
    plugins: {
      turbo: pluginTurbo,
    },
  },

  // customConfig rule
  // shadcn-ui 内部组件是自动生成的，不做太多限制
  {
    files: ['packages/@core/ui-kit/shadcn-ui/**/**'],
    rules: {
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: [
      'apps/**/**',
      'packages/effects/**/**',
      'packages/utils/**/**',
      'packages/types/**/**',
      'packages/locales/**/**',
    ],
    ignores: restrictedImportIgnores,
    rules: {
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },
  {
    // apps内部的一些基础规则
    files: ['apps/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['#/api/*'],
              message:
                'The #/api package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/layouts/*'],
              message:
                'The #/layouts package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/locales/*'],
              message:
                'The #/locales package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/stores/*'],
              message:
                'The #/stores package cannot be imported, please use the @core package itself',
            },
          ],
        },
      ],
      'perfectionist/sort-interfaces': 'off',
    },
  },
  {
    // @core内部组件，不能引入@vben/* 里面的包
    files: ['packages/@core/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@vben/*'],
              message:
                'The @core package cannot import the @vben package, please use the @core package itself',
            },
          ],
        },
      ],
    },
  },
  {
    // @core/shared内部组件，不能引入@vben/* 或者 @vben-core/* 里面的包
    files: ['packages/@core/base/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@vben/*', '@vben-core/*'],
              message:
                'The @vben-core/shared package cannot import the @vben package, please use the @core/shared package itself',
            },
          ],
        },
      ],
    },
  },

  {
    // 不能引入@vben/*里面的包
    files: [
      'packages/types/**/**',
      'packages/utils/**/**',
      'packages/icons/**/**',
      'packages/constants/**/**',
      'packages/styles/**/**',
      'packages/stores/**/**',
      'packages/preferences/**/**',
      'packages/locales/**/**',
    ],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@vben/*'],
              message:
                'The @vben package cannot be imported, please use the @core package itself',
            },
          ],
        },
      ],
    },
  },
  // 后端模拟代码，不需要太多规则
  {
    files: ['apps/backend-mock/**/**', 'docs/**/**'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      'n/no-extraneous-import': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
      'no-console': 'off',
      'unicorn/prefer-module': 'off',
    },
  },
  {
    files: ['**/**/playwright.config.ts'],
    rules: {
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['internal/**/**', 'scripts/**/**'],
    rules: {
      'no-console': 'off',
    },
  },

  globalIgnores([
    '.config/*',
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.vscode',
    '.idea',
    'dist',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
    '*.d.ts',
    'commitlint.config.js',
  ]),
]);
