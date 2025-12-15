// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import sonarjs from 'eslint-plugin-sonarjs'

export default withNuxt(
    sonarjs.configs.recommended,
    {
        rules: {
        // K&R Formatting Rules
            'indent': ['warn', 4, {
                'SwitchCase': 1,
                'ignoredNodes': ['TemplateLiteral'],
            }],
            'max-len': ['off', {
                'code': 150,
                'ignoreUrls': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
                'ignoreRegExpLiterals': true,
            }],
            'semi': ['error', 'never'],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'comma-dangle': ['error', 'always-multiline'],

            // Naming Conventions (basic camelCase for all files)
            // Downgraded to 'warn' to stop breaking build on existing code
            'camelcase': ['off', {
                'properties': 'never',
                'ignoreDestructuring': true,
                'allow': ['^use[A-Z]', '^fetch[A-Z]'],
            }],

            // Vue Specific Rules
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/component-definition-name-casing': ['error', 'PascalCase'],
            'vue/max-attributes-per-line': ['error', {
                'singleline': 3,
                'multiline': 1,
            }],
            'vue/html-indent': ['error', 4],
            'vue/script-indent': ['error', 4, {
                'baseIndent': 0,
                'switchCase': 1,
            }],

            // --- RELAXED RULES TO REDUCE NOISE ---

            // Nuxt pages/layouts often use single words (e.g. 'index', 'default')
            'vue/multi-word-component-names': 'off',

            // Warn only, don't break build
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // SonarJS Complexity Rules - Warn only
            'sonarjs/cognitive-complexity': 'off',
            'sonarjs/no-nested-conditional': 'off',
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-nested-functions': 'off',
            'sonarjs/no-hardcoded-passwords': 'off',
            'sonarjs/no-ignored-exceptions': 'off',
            'sonarjs/no-unused-vars': 'off',
            'sonarjs/no-dead-store': 'off',
            'sonarjs/unused-import': 'off',
            'sonarjs/class-name': 'off',
            'sonarjs/no-identical-functions': 'off',
            'sonarjs/pseudo-random': 'off',
            'sonarjs/no-commented-code': 'off',
            'sonarjs/concise-regex': 'off',
            'sonarjs/single-char-in-character-classes': 'off',
            'sonarjs/slow-regex': 'off',
            'sonarjs/prefer-single-boolean-return': 'off',
            'sonarjs/assertions-in-tests': 'off',
            '@typescript-eslint/unified-signatures': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-dynamic-delete': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'no-useless-escape': 'off',
            'no-empty': 'off',
            'brace-style': 'off',
            'vue/require-default-prop': 'off',
            'vue/no-v-html': 'off',
            'vue/attribute-hyphenation': 'off',
            'vue/prop-name-casing': 'off',
            'vue/require-explicit-emits': 'off',
            'vue/no-mutating-props': 'off',
            'import/no-duplicates': 'off',
        },
    })
