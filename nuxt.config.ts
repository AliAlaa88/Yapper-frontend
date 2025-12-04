// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/test-utils/module'],
    ssr: false,
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.NUXT_PUBLIC_API_URL,
            mockApi: process.env.NUXT_PUBLIC_MOCK_API || 'false',
            gifApiKey: process.env.NUXT_PUBLIC_GIF_API_KEY,
            recaptcha: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
            socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL,
            socketPath: process.env.NUXT_PUBLIC_SOCKET_PATH,
        },
    },

    plugins: [
        './app/plugins/axios.ts',
        './app/plugins/vue-query.ts',
        './app/plugins/services.client.ts',
        './app/plugins/recaptcha.ts',
        './app/plugins/socket.client.ts',
    ],
    i18n: {
        locales: [
            {
                code: 'en',
                name: 'English',
                dir: 'ltr',
                file: 'en.json',
            },
            {
                code: 'ar',
                name: 'العربية',
                dir: 'rtl',
                file: 'ar.json',
            },
        ],
        defaultLocale: 'en',
        langDir: 'locales/',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
            fallbackLocale: 'en',
        },
    },
})
