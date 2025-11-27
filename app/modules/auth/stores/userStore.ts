import { defineStore } from 'pinia'
import type { User, AuthResponse } from '../types/user'
import Cookies from 'js-cookie'
import { toRaw, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const isLoggedIn = () =>
        localStorage.getItem('user') !== null && useCookie('access_token').value !== undefined

    const getUser = () => user.value

    const getAccessToken = () => accessToken.value

    const setAuth = (authData: AuthResponse) => {
        user.value = authData.user
        console.log('Setting auth user:', user.value)
        accessToken.value = authData.access_token
        if (import.meta.client) {
            const token = useCookie('access_token')
            token.value = authData.access_token
            // Unwrap Vue Proxy before stringifying
            const rawUser = toRaw(authData.user)
            localStorage.setItem('user', JSON.stringify(rawUser))
        }
    }

    const setUser = (userData: User) => {
        user.value = userData

        if (import.meta.client) {
            const rawUser = toRaw(userData)
            localStorage.setItem('user', JSON.stringify(rawUser))
        }
    }

    const updateUser = (updates: Partial<User>) => {
        if (user.value) {
            user.value = { ...user.value, ...updates }

            if (import.meta.client) {
                localStorage.setItem('user', JSON.stringify(user.value))
            }
        }
    }

    const logout = () => {
        user.value = null
        accessToken.value = null

        if (import.meta.client) {
            Cookies.remove('access_token')
            localStorage.removeItem('user')
        }
    }

    const restoreSession = () => {
        if (import.meta.client) {
            const token = useCookie('access_token')
            const userStr = localStorage.getItem('user')

            if (token.value && userStr) {
                try {
                    accessToken.value = token.value
                    user.value = JSON.parse(userStr)
                } catch (error) {
                    console.error('Failed to restore session:', error)
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
        restoreSession,
    }
})
