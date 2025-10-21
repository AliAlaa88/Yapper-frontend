import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const isMockApi = config.public.mockApi === true
    const apiBase = isMockApi ? 'http://localhost:3001' : (config.public.apiUrl as string)

    const yapperApi: AxiosInstance = axios.create({
        baseURL: apiBase,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        withCredentials: !isMockApi,
    })

    return {
        provide: {
            axios: yapperApi,
            yapperApi,
        },
    }
})
