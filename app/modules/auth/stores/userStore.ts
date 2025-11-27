import { defineStore } from 'pinia'
import type { User, AuthResponse } from '../types/user'
import Cookies from 'js-cookie'
import { toRaw } from 'vue'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        accessToken: null as string | null,
    }),

    getters: {
        isLoggedIn: () =>
            localStorage.getItem('user') !== null && useCookie('access_token').value !== undefined,
    },

    actions: {
        setAuth(authData: AuthResponse) {
            this.user = authData.user
            console.log('Setting auth user:', this.user)
            this.accessToken = authData.access_token
            if (import.meta.client) {
                const token = useCookie('access_token')
                token.value = authData.access_token
                // Unwrap Vue Proxy before stringifying
                const rawUser = toRaw(authData.user)
                localStorage.setItem('user', JSON.stringify(rawUser))
            }
        },

        setUser(userData: User) {
            this.user = userData

            if (import.meta.client) {
                const rawUser = toRaw(userData)
                localStorage.setItem('user', JSON.stringify(rawUser))
            }
        },

        updateUser(updates: Partial<User>) {
            if (this.user) {
                this.user = { ...this.user, ...updates }

                if (import.meta.client) {
                    localStorage.setItem('user', JSON.stringify(this.user))
                }
            }
        },

        logout() {
            this.user = null
            this.accessToken = null

            if (import.meta.client) {
                Cookies.remove('access_token')
                localStorage.removeItem('user')
            }
        },

        restoreSession() {
            if (import.meta.client) {
                const token = useCookie('access_token')
                const userStr = localStorage.getItem('user')

                if (token.value && userStr) {
                    try {
                        this.accessToken = token.value
                        this.user = JSON.parse(userStr)
                    } catch (error) {
                        console.error('Failed to restore session:', error)
                        this.logout()
                    }
                }
            }
        },
    },
})
