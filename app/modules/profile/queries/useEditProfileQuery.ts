import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'
import { updateMe } from '../composables/useMe'

export function useEditProfileMutation(userId: string) {
    const { $userInfoService } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (updates: Partial<Me>) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: (updatedUser: Me) => {
            queryClient.setQueryData(['me'], updatedUser)
            updateMe(updatedUser)
        },
    })
}
