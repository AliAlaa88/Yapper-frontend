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
    plugins: [
        './app/plugins/vue-query.client.ts',
        './app/plugins/axios.client.ts',
        './app/plugins/services.client.ts',
    ],
})
