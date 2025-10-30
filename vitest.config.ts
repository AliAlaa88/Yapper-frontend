import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        projects: [
            {
                plugins: [vue()],
                resolve: {
                    alias: {
                        '#app': resolve(__dirname, 'node_modules/nuxt/dist/app'),
                        '#imports': resolve(__dirname, '.nuxt/imports'),
                    },
                },
                test: {
                    name: 'unit',
                    include: [
                        'test/{e2e,unit}/*.{test,spec}.ts',
                        'app/modules/**/test/unit/*.{test,spec}.ts',
                    ],
                    environment: 'happy-dom',
                },
            },
            await defineVitestProject({
                test: {
                    name: 'nuxt',
                    include: ['test/nuxt/*.{test,spec}.ts'],
                    environment: 'nuxt',
                },
            }),
        ],
    },
})
