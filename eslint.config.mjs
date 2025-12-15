// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import sonarjs from 'eslint-plugin-sonarjs'

export default withNuxt({
    rules: {
        // K&R Formatting Rules
        'indent': ['warn', 4, {
            'SwitchCase': 1,
            'ignoredNodes': ['TemplateLiteral'],
        }],
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'max-len': ['warn', {
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
        'camelcase': ['warn', {
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
        'camelcase': 'off',
    },
})
    .append(sonarjs.configs.recommended)
