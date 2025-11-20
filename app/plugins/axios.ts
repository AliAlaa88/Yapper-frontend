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
                const token = useCookie('access_token')
                console.log("Attaching token to request:", token.value);
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
            const requestUrl = error.config?.url
            console.log("Response error URL:", requestUrl);
            console.log(`${apiBase}/auth/refresh`);
            if (error.response?.status === 401) {
                if (process.client && window.location.pathname !== '/auth/login' && requestUrl !== `${apiBase}/auth/refresh`) {
                    const nuxtApp = useNuxtApp()
                    const authService = nuxtApp.$authService
                    const response = await authService.GetAccessToken()
                    const access_token = response.data.access_token;
                    const token = useCookie('access_token')
                    token.value = access_token;
                    // Retry the original request with the new token
                    const originalRequest = error.config;
                    originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                    return yapperApi(originalRequest);
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
