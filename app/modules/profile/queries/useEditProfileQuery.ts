import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UserAction } from '../types/user'
import { updateMe } from '../composables/useMe'

export function useEditProfileMutation(userId: string, username: string) {
    const { $userInfoService } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (updates: UserAction) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: (updatedUser: UserAction) => {
            queryClient.setQueryData(['user', username], updatedUser)
            updateMe(updatedUser)
        },
    })
}
