// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@pinia/nuxt'],
    ssr: false,
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',
            mockApi: process.env.NUXT_PUBLIC_MOCK_API || 'false',
        },
    },
    plugins: ['./app/plugins/axios.ts', './app/plugins/vue-query.ts', './app/plugins/services.ts'],
})