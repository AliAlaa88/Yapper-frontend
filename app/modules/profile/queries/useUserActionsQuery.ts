import { useMutation, useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { OtherUser } from '../types/user'

export function useUserActionsQuery(userId: Ref<string | undefined>) {
    const { $userInfoService, $queryClient } = useNuxtApp()

    const userQuery = useQuery<OtherUser>({
        queryKey: computed(() => ['user', userId.value]),
        queryFn: () => $userInfoService.getUserByID(userId.value!),
        enabled: !!userId,
    })

    const followMutation = useMutation({
        mutationFn: () => $userInfoService.followUser(userId.value),
        onSuccess: () => {
            console.log('success follow')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to follow:', error)
        },
    })

    const unfollowMutation = useMutation({
        mutationFn: () => $userInfoService.unfollowUser(userId.value),
        onSuccess: () => {
            console.log('unfollow successfully')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to unfollow:', error)
        },
    })

    const blockMutation = useMutation({
        mutationFn: () => $userInfoService.blockUser(userId.value),
        onSuccess: () => {
            console.log('block successfully')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to block:', error)
        },
    })

    const unblockMutation = useMutation({
        mutationFn: () => $userInfoService.unblockUser(userId.value),
        onSuccess: () => {
            console.log('unblock successfully')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to unblock:', error)
        },
    })

    const muteMutation = useMutation({
        mutationFn: () => $userInfoService.muteUser(userId.value),
        onSuccess: () => {
            console.log('mute successfully')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to mute:', error)
        },
    })

    const unmuteMutation = useMutation({
        mutationFn: () => $userInfoService.unmuteUser(userId.value),
        onSuccess: () => {
            console.log('unmute successfully')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to unmute:', error)
        },
    })

    const removeFollowerMutation = useMutation({
        mutationFn: () => $userInfoService.removeFollower(userId.value),
        onSuccess: () => {
            console.log('remove this follower correctly')
            $queryClient.invalidateQueries({ queryKey: ['user', userId.value] })
        },
        onError: (error) => {
            console.error('Failed to remove this follower:', error)
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
