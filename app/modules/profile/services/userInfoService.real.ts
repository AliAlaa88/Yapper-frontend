import axios from 'axios'
import type {
    Me,
    MeApiResponse,
    OtherUser,
    OtherUserApiResponse,
    ActionApiResponse,
    ImageUploadApiResponse,
    FollowUser,
    FollowListApiResponse,
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
            return response.data.data
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
            if (!response.data || !response.data.data) {
                throw new Error('User not found')
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
        if (!userId) {
            throw new Error('User ID is required')
        }
        try {
            const response = await $axios.get<OtherUserApiResponse>(`/users/${userId}`)
            if (!response.data || !response.data.data) {
                throw new Error('User not found')
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
                throw new Error('Failed to update profile')
            }
            return response.data.data
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

    async uploadAvatar(userId: string, file: File): Promise<string> {
        const { $axios } = useNuxtApp()
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await $axios.post<ImageUploadApiResponse>(
                '/users/me/upload-avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            if (!response.data || !response.data.data) {
                throw new Error('Failed to upload avatar')
            }
            return response.data.data.image_url
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 400) {
                    throw new Error('Invalid file upload')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async uploadCoverPhoto(userId: string, file: File): Promise<string> {
        const { $axios } = useNuxtApp()
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await $axios.post<ImageUploadApiResponse>(
                '/users/me/upload-cover',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            if (!response.data || !response.data.data) {
                throw new Error('Failed to upload cover photo')
            }
            return response.data.data.image_url
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 400) {
                    throw new Error('Invalid file upload')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async getFollowers(userId: string, mutual: boolean): Promise<FollowUser[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<FollowListApiResponse>(
                `/users/${userId}/followers`,
                {
                    params: { following: mutual }
                }
            )
            if (!response.data || !response.data.data) {
                throw new Error('Failed to fetch followers')
            }
            return response.data.data.data
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

    async getFollowing(userId: string): Promise<FollowUser[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<FollowListApiResponse>(
                `/users/${userId}/following`,
            )
            if (!response.data || !response.data.data) {
                throw new Error('Failed to fetch following list')
            }
            return response.data.data.data
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
}
