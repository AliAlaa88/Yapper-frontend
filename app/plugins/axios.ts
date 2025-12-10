import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/modules/auth/stores/userStore'

export default defineNuxtPlugin(() => {
    const userStore = useUserStore()
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
                const token = useCookie('access_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token.value}`
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
            const requestUrl = error.config?.url || ''
            const isAuthEndpoint = requestUrl.includes('/auth/')
            
            if ((error.response?.status === 400 || error.response?.status === 401) && isAuthEndpoint) {
                if (process.client) {
                    useCookie('access_token').value = null
                    useCookie('refresh_token').value = null
                    userStore.logout()
                    if (window.location.pathname !== '/auth/login') {
                        navigateTo('/auth/login')
                    }
                }
                return Promise.reject(error)
            }
            
            if (error.response?.status === 401 && !isAuthEndpoint) {
                if (process.client && window.location.pathname !== '/auth/login' && !error.config?._retry) {
                    error.config._retry = true
                    
                    try {
                        const nuxtApp = useNuxtApp()
                        const authService = nuxtApp.$authService
                        const response = await authService.GetAccessToken()
                        const access_token = response.data.access_token
                        const token = useCookie('access_token')
                        token.value = access_token
                        // Retry the original request with the new token
                        const originalRequest = error.config
                        originalRequest.headers['Authorization'] = `Bearer ${access_token}`
                        return yapperApi(originalRequest)
                    } catch (refreshError) {
                        // Refresh failed, clear access token and redirect
                        useCookie('access_token').value = null
                        userStore.logout()
                        navigateTo('/auth/login')
                        return Promise.reject(refreshError)
                    }
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
