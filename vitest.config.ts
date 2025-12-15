import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './app'),
            '@': path.resolve(__dirname, './app'),
            '#app': path.resolve(__dirname, './node_modules/nuxt/dist/app'),
            '#imports': resolve(__dirname, '.nuxt/imports'),
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './tests/setup.ts',
        include: [
            'test/{e2e,unit}/*.{test,spec}.ts',
            // include module-level unit tests (e.g., app/modules/**/test/unit)
            'app/modules/**/test/unit/*.{test,spec}.ts',
        ],
        coverage: {
            provider: 'v8', // or 'istanbul'
            reporter: ['text', 'html', 'lcov'],
            all: true, // include files with NO tests
            include: ['app/**/*.{js,ts,vue}'],
            exclude: ['**/*.d.ts', 'dist/**', 'node_modules/**'],
        },
    },
})
