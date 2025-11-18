import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'
import { updateMe } from '../composables/useMe'

export function useEditProfileMutation(userId: string) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const editProfileMutation = useMutation({
        mutationFn: (updates: Partial<Me>) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: (updatedUser: Me) => {
            $queryClient.setQueryData(['me'], updatedUser)
            updateMe(updatedUser)
        },
    })

    const uploadCoverPhotoMutation = useMutation({
        mutationFn: (file: File) => $userInfoService.uploadCoverPhoto(userId, file),
        onSuccess: (updatedUser: Me) => {
            $queryClient.setQueryData(['me'], updatedUser)
            updateMe(updatedUser)
        },
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => $userInfoService.uploadAvatar(userId, file),
        onSuccess: (updatedUser: Me) => {
            $queryClient.setQueryData(['me'], updatedUser)
            updateMe(updatedUser)
        },
    })

    return {
        editProfileMutation,
        uploadCoverPhotoMutation,
        uploadAvatarMutation,
    }
}
