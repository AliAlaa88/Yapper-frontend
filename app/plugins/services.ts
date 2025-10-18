// /plugins/service.ts
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { serviceFactories } from '../core/serviceRegistery'

export default defineNuxtPlugin((nuxtApp) => {
    // Debug: Check runtime config
    const config = useRuntimeConfig()
    console.log('[services plugin] Runtime config:', {
        apiUrl: config.public.apiUrl,
        mockApi: config.public.mockApi,
    })

    const services: Record<string, any> = {}

    for (const [key, factory] of Object.entries(serviceFactories)) {
        services[key] = factory() // create service at runtime
        nuxtApp.provide(key, services[key])
    }

    // optional: provide all services together
    nuxtApp.provide('services', services)
})
