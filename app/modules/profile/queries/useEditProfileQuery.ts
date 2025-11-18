import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'

export function useEditProfileMutation(userId: string) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const editProfileMutation = useMutation({
        mutationFn: (updates: Partial<Me>) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: async () => {
            // Wait for the query to refetch before resolving
            await $queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })

    const uploadCoverPhotoMutation = useMutation({
        mutationFn: (file: File) => $userInfoService.uploadCoverPhoto(userId, file),
        onSuccess: async () => {
            await $queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => $userInfoService.uploadAvatar(userId, file),
        onSuccess: async () => {
            await $queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })

    return {
        editProfileMutation,
        uploadCoverPhotoMutation,
        uploadAvatarMutation,
    }
}
