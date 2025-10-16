import { defineNuxtPlugin } from 'nuxt/app'
import { services } from '../app/core/serviceRegistry'

export default defineNuxtPlugin((nuxtApp) => {
    for (const [key, service] of Object.entries(services)) {
        nuxtApp.provide(key, service)
    }
})
