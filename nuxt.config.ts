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
    hooks: {
        'pages:extend'(pages) {
            // Add profile routes from profile module
            pages.push(
                {
                    name: 'profile',
                    path: '/profile/:username',
                    file: '~/modules/profile/pages/[username].vue',
                },
                {
                    name: 'profile-replies',
                    path: '/profile/:username/replies',
                    file: '~/modules/profile/pages/[username].vue',
                },
                {
                    name: 'profile-media',
                    path: '/profile/:username/media',
                    file: '~/modules/profile/pages/[username].vue',
                },
                {
                    name: 'profile-likes',
                    path: '/profile/:username/likes',
                    file: '~/modules/profile/pages/[username].vue',
                },
            )
        },
    },
})
