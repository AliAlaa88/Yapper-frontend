import { useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { ApiNotification, NotificationsApiData } from '../types/notifications'

export const useGetNotificationsQuery = () => {
    const { $notificationsService } = useNuxtApp()
    const query = useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: ({ pageParam = 1 }: { pageParam?: number }) => {
            const res = $notificationsService.getNotifications(pageParam)
            console.log('res', res)
            return res
        },
        getNextPageParam: (lastPage) => {
            return lastPage.has_next ? lastPage.page + 1 : undefined
        },
        initialPageParam: 1,
    })

    const notifications = computed<ApiNotification[]>(() => {
        console.log('notifications', query.data.value?.pages)
        return (
            query.data.value?.pages.flatMap((page: NotificationsApiData) => page.notifications) ??
            []
        )
    })

    return {
        notifications,
        isLoadingNotifications: query.isLoading,
        isFetchingNotifications: query.isFetching,
        isErrorNotifications: query.isError,
        errorNotifications: query.error,
        isSuccessfullyNotifications: query.isSuccess,
        hasNextNotifications: query.hasNextPage,
        hasPreviousNotifications: query.hasPreviousPage,
        isFetchingNextNotifications: query.isFetchingNextPage,
        isFetchingPreviousNotifications: query.isFetchingPreviousPage,
        fetchNextNotifications: query.fetchNextPage,
        fetchPreviousNotifications: query.fetchPreviousPage,
        refetchNotifications: query.refetch,
    }
}
