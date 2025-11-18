import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import Cookies from 'js-cookie'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const isMockApi = config.public.mockApi.toString() === 'true'
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

    yapperApi.interceptors.request.use(
        (config) => {
            if (process.client) {
                const token = Cookies.get('access_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        },
    )

    yapperApi.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                if (process.client && window.location.pathname !== '/auth/login') {
                    const nuxtApp = useNuxtApp()
                    const authService = nuxtApp.$authService
                    const response = await authService.GetAccessToken()
                    const access_token = response.data.access_token;
                    Cookies.set('access_token', access_token)
                }
            }
            return Promise.reject(error)
        },
    )

    return {
        provide: {
            axios: yapperApi,
            yapperApi,
        },
    }
})
