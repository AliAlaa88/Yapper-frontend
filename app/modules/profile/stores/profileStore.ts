import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Me, OtherUser } from '../types/user'

export const useProfileStore = defineStore('profile', () => {
    const profile = ref<Me | OtherUser | null>(null)
    const isMyProfile = ref(false)

    const setProfile = (user: Me | OtherUser, isCurrentUser: boolean) => {
        profile.value = user
        isMyProfile.value = isCurrentUser
    }

    const clearProfile = () => {
        profile.value = null
        isMyProfile.value = false
    }

    return {
        profile,
        isMyProfile,
        setProfile,
        clearProfile,
    }
})
