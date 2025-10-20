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

    return { userQuery, followMutation, unfollowMutation }
}
