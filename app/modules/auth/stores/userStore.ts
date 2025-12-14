import { defineStore } from 'pinia'
import type { User, AuthResponse } from '../types/user'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const isLoggedIn = computed(() => !!user.value && !!accessToken.value)

    const getUser = () => user.value

    // Initialize accessToken from cookie synchronously before watch setup
    // This ensures cookie → store sync happens first, then watch handles store → cookie
    if (import.meta.client) {
        const token = useCookie('access_token')
        if (token.value) {
            accessToken.value = token.value
        }
    }

    // Watch accessToken and sync to cookie whenever it changes (store → cookie)
    // Note: No immediate: true to avoid overwriting cookie with null on init
    watch(accessToken, (newToken) => {
        if (import.meta.client) {
            const token = useCookie('access_token')
            token.value = newToken
            console.log('access token changed', newToken ? 'present' : 'null')
        }
    })

    // Watch cookie for external changes (from axios/middleware) and sync to store (cookie → store)
    // This ensures store stays in sync when token is refreshed via axios interceptor
    if (import.meta.client) {
        const tokenCookie = useCookie('access_token')
        watch(
            () => tokenCookie.value,
            (cookieToken) => {
                // Only sync if different to avoid infinite loops
                // Convert undefined to null to match accessToken type
                const tokenValue = cookieToken ?? null
                if (tokenValue !== accessToken.value) {
                    accessToken.value = tokenValue
                }
            },
        )
    }

    const getAccessToken = () => accessToken.value

    const setAccessToken = (token: string | null) => {
        accessToken.value = token
        // Cookie will be synced automatically by the watch
    }

    const setAuth = (authData: AuthResponse) => {
        // Always set token first, then user
        // This ensures token is available before any reactive effects trigger
        if (!authData.access_token) {
            console.warn('[UserStore] setAuth called without access_token')
            return
        }
        accessToken.value = authData.access_token
        user.value = authData.user
        // Cookie will be synced automatically by the watch above
    }

    const setUser = (userData: User) => {
        user.value = userData
    }

    const updateUser = (updates: Partial<User>) => {
        if (user.value) {
            user.value = { ...user.value, ...updates }
        }
    }

    const logout = () => {
        user.value = null
        accessToken.value = null // Watch will automatically sync cookie to null
        localStorage.removeItem('yapper-search-history')
    }

    const initAuth = async (fetchUserFn: () => Promise<User>) => {
        if (import.meta.client) {
            const token = useCookie('access_token')
            if (token.value && !user.value) {
                accessToken.value = token.value
                try {
                    user.value = await fetchUserFn()
                } catch (error) {
                    console.error('Failed to initialize auth:', error)
                    logout()
                }
            }
        }
    }

    return {
        user,
        accessToken,
        isLoggedIn,
        getUser,
        getAccessToken,
        setAccessToken,
        setAuth,
        setUser,
        updateUser,
        logout,
        initAuth,
    }
})
