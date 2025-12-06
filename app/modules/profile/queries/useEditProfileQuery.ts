import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'

export function useEditProfileMutation(userId: string, username: string) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const editProfileMutation = useMutation({
        mutationFn: (updates: Partial<Me>) => $userInfoService.updateUserProfile(userId, updates),
        onSuccess: (data, variables) => {
            console.log('profile updated successfully', data)
            console.log('username changed', variables)
            if (variables.username && variables.username !== username) {
                cacheInvalidation.onUsernameChange($queryClient, username)
            } else {
                cacheInvalidation.onProfileUpdate($queryClient, username)
            }
        },
    })

    const uploadCoverPhotoMutation = useMutation<string, Error, File>({
        mutationFn: (file: File) => $userInfoService.uploadCoverPhoto(userId, file),
        onSuccess: () => {
            cacheInvalidation.onCoverPhotoChange($queryClient, username)
        },
    })

    const uploadAvatarMutation = useMutation<string, Error, File>({
        mutationFn: (file: File) => $userInfoService.uploadAvatar(userId, file),
        onSuccess: () => {
            cacheInvalidation.onAvatarChange($queryClient, username)
        },
    })

    return {
        editProfileMutation,
        uploadCoverPhotoMutation,
        uploadAvatarMutation,
    }
}
