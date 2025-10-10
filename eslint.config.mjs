// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        // K&R Formatting Rules
        'indent': ['error', 4, {
            'SwitchCase': 1,
            'ignoredNodes': ['TemplateLiteral'],
        }],
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'max-len': ['warn', {
            'code': 100,
            'ignoreUrls': true,
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
            'ignoreRegExpLiterals': true,
        }],
        'semi': ['error', 'never'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'comma-dangle': ['error', 'always-multiline'],

        // Naming Conventions (basic camelCase for all files)
        'camelcase': ['error', {
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
    },
})
