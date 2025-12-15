import { defineNuxtPlugin } from 'nuxt/app'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: 10 * 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
            mutations: {
                retry: 0,
            },
        },
    })

export default defineNuxtPlugin((nuxtApp) => {
    const queryClient = createQueryClient()

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
    // nuxtApp.vueApp.component('VueQueryDevtools', VueQueryDevtools)

    return {
        provide: {
            queryClient,
        },
    }
})
