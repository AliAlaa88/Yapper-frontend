import axios from 'axios'
import type {
    Me,
    MeApiResponse,
    OtherUser,
    OtherUserApiResponse,
    ActionApiResponse,
} from '../types/user'
import { useNuxtApp } from 'nuxt/app'

export const userInfoServiceReal = {
    async getMe(): Promise<Me> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<MeApiResponse>('/users/me')
            if (!response.data || !response.data.data) {
                throw new Error('User not found')
            }
            const myData = response.data.data
            console.log('my data', myData)
            return myData
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async getUserInfoByUsername(username: string): Promise<OtherUser> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<OtherUserApiResponse>(
                `/users/by/username/${username}`,
            )
            console.log(response.data.data)
            if (!response.data || !response.data.data) {
                throw new Error(`User not found: ${username}`)
            }
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async getUserByID(userId: string): Promise<OtherUser> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<OtherUserApiResponse>(`/users/${userId}`)
            if (!response.data || !response.data.data) {
                throw new Error(`User not found: ${userId}`)
            }

            console.log('by id', response.data.data)
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async followUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        try {
            await $axios.post<ActionApiResponse>(`/users/${userId}/follow`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 403) {
                    throw new Error('cannot follow user, user blocked you')
                } else if (error.response?.status === 400) {
                    throw new Error('You cannot follow yourself')
                } else if (error.response?.status === 409) {
                    throw new Error('Already following this user')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async unfollowUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        try {
            await $axios.delete<ActionApiResponse>(`/users/${userId}/unfollow`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async blockUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()

        try {
            await $axios.post<ActionApiResponse>(`/users/${userId}/block`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 400) {
                    throw new Error('You cannot block yourself')
                } else if (error.response?.status === 409) {
                    throw new Error('Already blocked this user')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async unblockUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()

        try {
            await $axios.delete<ActionApiResponse>(`/users/${userId}/unblock`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async muteUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()

        try {
            await $axios.post<ActionApiResponse>(`/users/${userId}/mute`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 400) {
                    throw new Error('You cannot mute yourself')
                } else if (error.response?.status === 409) {
                    throw new Error('Already muted this user')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async unmuteUser(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()

        try {
            await $axios.delete<ActionApiResponse>(`/users/${userId}/unmute`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async removeFollower(userId: string): Promise<void> {
        const { $axios } = useNuxtApp()

        try {
            await $axios.delete<ActionApiResponse>(`/users/${userId}/remove-follower`)
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async updateUserProfile(userId: string, updates: Partial<Me>): Promise<Me> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.patch<MeApiResponse>('/users/me', updates)
            if (!response.data || !response.data.data) {
                throw new Error('Failed to update user profile')
            }
            const userData = response.data.data
            console.log('updated profile', userData)
            return userData
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 400) {
                    throw new Error('Invalid update data')
                } else if (error.response?.status === 409) {
                    throw new Error('Username already taken')
                }
            }
            throw new Error('Something went wrong')
        }
    },
}
