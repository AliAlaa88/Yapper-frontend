import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'

export function useEditProfileMutation(userId: string) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const editProfileMutation = useMutation({
        mutationFn: (updates: Partial<Me>) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: async () => {
            await $queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })

    const uploadCoverPhotoMutation = useMutation<string, Error, File>({
        mutationFn: (file: File) => $userInfoService.uploadCoverPhoto(userId, file),
    })

    const uploadAvatarMutation = useMutation<string, Error, File>({
        mutationFn: (file: File) => $userInfoService.uploadAvatar(userId, file),
    })

    return {
        editProfileMutation,
        uploadCoverPhotoMutation,
        uploadAvatarMutation,
    }
}
