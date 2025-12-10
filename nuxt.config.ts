import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
        '@nuxt/test-utils/module',
        '@nuxt/image',
    ],
    ssr: false,
    css: ['~/assets/css/main.css'],

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Yapper. It\'s what\'s happening',
            meta: [
                { name: 'description', content: 'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.' },
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'theme-color', content: '#1DA1F2' },
                { property: 'og:site_name', content: 'Yapper' },
                { property: 'og:type', content: 'website' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@yapper' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.NUXT_PUBLIC_API_URL,
            mockApi: process.env.NUXT_PUBLIC_MOCK_API || 'false',
            gifApiKey: process.env.NUXT_PUBLIC_GIF_API_KEY,
            recaptcha: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
            etest: process.env.NUXT_PUBLIC_ETEST || 'false',
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
