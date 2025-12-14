import { defineStore } from 'pinia'
import type { User, AuthResponse } from '../types/user'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const isLoggedIn = computed(() => !!user.value && !!accessToken.value)

    const getUser = () => user.value

    watch(
        accessToken,
        () => {
            const token = useCookie('access_token')
            token.value = accessToken.value
            console.log('access token changed', token.value)
        },
        { immediate: true },
    )

    const getAccessToken = () => accessToken.value

    const setAuth = (authData: AuthResponse) => {
        user.value = authData.user
        accessToken.value = authData.access_token
        if (import.meta.client) {
            const token = useCookie('access_token')
            token.value = authData.access_token
        }
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

        if (import.meta.client) {
            const token = useCookie('access_token')
            token.value = null
        }
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
        setAuth,
        setUser,
        updateUser,
        logout,
        initAuth,
    }
})
