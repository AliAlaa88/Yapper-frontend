import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import type { User } from '../types/user'


export function useUserActionsQuery(userId: string) {
    const { $userInfoService } = useNuxtApp()
    const queryClient = useQueryClient()

    const userQuery = useQuery<User>({
        queryKey: ['user', userId],
        queryFn: () => $userInfoService.getUserByID(userId),
    })

    const followMutation = useMutation({
        mutationFn: () => $userInfoService.followUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const unfollowMutation = useMutation({
        mutationFn: () => $userInfoService.unfollowUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const blockMutation = useMutation({
        mutationFn: () => $userInfoService.blockUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const unblockMutation = useMutation({
        mutationFn: () => $userInfoService.unblockUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const muteMutation = useMutation({
        mutationFn: () => $userInfoService.muteUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const unmuteMutation = useMutation({
        mutationFn: () => $userInfoService.unmuteUser(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })

    const removeFollowerMutation = useMutation({
        mutationFn: () => $userInfoService.removeFollower(userId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
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
