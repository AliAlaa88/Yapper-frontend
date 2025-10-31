import { useMutation, useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { UserAction } from '../types/user'

export function useUserActionsQuery(userId: Ref<string | undefined>) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const userQuery = useQuery<UserAction>({
        queryKey: computed(() => ['user', userId.value]),
        queryFn: () => $userInfoService.getUserByID(userId.value!),
    })

    const followMutation = useMutation({
        mutationFn: () => $userInfoService.followUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const unfollowMutation = useMutation({
        mutationFn: () => $userInfoService.unfollowUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const blockMutation = useMutation({
        mutationFn: () => $userInfoService.blockUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const unblockMutation = useMutation({
        mutationFn: () => $userInfoService.unblockUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const muteMutation = useMutation({
        mutationFn: () => $userInfoService.muteUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const unmuteMutation = useMutation({
        mutationFn: () => $userInfoService.unmuteUser(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    const removeFollowerMutation = useMutation({
        mutationFn: () => $userInfoService.removeFollower(userId.value),
        onSuccess: (data) => {
            console.log(data)
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
    })

    return {
        userQuery,
        followMutation,
        unfollowMutation,
        blockMutation,
        unblockMutation,
        muteMutation,
        unmuteMutation,
        removeFollowerMutation,
    }
}
