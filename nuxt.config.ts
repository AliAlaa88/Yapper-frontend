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
            pages.push({
                name: 'profile',
                path: '/profile/:username',
                file: '~/modules/profile/pages/[username].vue',
                children: [
                    {
                        name: 'profile-replies',
                        path: 'replies',
                        file: '~/modules/profile/pages/[username]/replies.vue',
                    },
                    {
                        name: 'profile-media',
                        path: 'media',
                        file: '~/modules/profile/pages/[username]/media.vue',
                    },
                    {
                        name: 'profile-likes',
                        path: 'likes',
                        file: '~/modules/profile/pages/[username]/likes.vue',
                    },
                ],
            })
        },
    },
})
