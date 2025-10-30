import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UserAction } from '../types/user'
import { updateMe } from '../composables/useMe'

interface EditProfileData {
    name?: string
    bio?: string
    country?: string
    created_at?: string
    avatar_url?: string
    cover_url?: string
}

export function useEditProfileMutation(userId: string, username: string) {
    const { $userInfoService } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (updates: EditProfileData) =>
            $userInfoService.updateUserProfile(userId, updates),
        onSuccess: (updatedUser: UserAction) => {
            queryClient.setQueryData(['user', username], updatedUser)
            updateMe(updatedUser)
        },
    })
}
