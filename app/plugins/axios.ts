import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
    const apiBase = process.env.NUXT_PUBLIC_API_URL||'https://dev.yapper.cmp27.space'

    const yapperApi: AxiosInstance = axios.create({
        baseURL: apiBase,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        withCredentials: true,
    })

    return {
        provide: {
            axios: yapperApi,
            yapperApi,
        },
    }
})
