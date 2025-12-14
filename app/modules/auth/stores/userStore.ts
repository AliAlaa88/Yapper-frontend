import { defineStore } from 'pinia'
import type { User, AuthResponse } from '../types/user'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const isLoggedIn = computed(() => !!user.value && !!accessToken.value)

    const getUser = () => user.value

    if (import.meta.client) {
        const token = useCookie('access_token')
        if (token.value) {
            accessToken.value = token.value
        }
    }

    watch(accessToken, (newToken) => {
        if (import.meta.client) {
            const token = useCookie('access_token')
            token.value = newToken
            console.log('access token changed', newToken ? 'present' : 'null')
        }
    })

    if (import.meta.client) {
        const tokenCookie = useCookie('access_token')
        watch(
            () => tokenCookie.value,
            (cookieToken) => {
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
    }

    const setAuth = (authData: AuthResponse) => {
        if (!authData.access_token) {
            console.warn('[UserStore] setAuth called without access_token')
            return
        }
        accessToken.value = authData.access_token
        user.value = authData.user
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
        accessToken.value = null
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
