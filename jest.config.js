module.exports = {
    preset: '@nuxt/test-utils',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'ts', 'vue', 'mjs'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '.*\\.(vue)$': '@vue/vue3-jest',
        '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        // you might need aliases for other Nuxt auto-imports/composables
    },
    transformIgnorePatterns: ['node_modules/(?!(nuxt|@nuxt/test-utils))'],
    setupFiles: [
        // optional: e.g. a setup file to mock Nuxt composables or initialize globals
    ],
}
