import { useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { ApiMentions, MentionsApiData } from '../types/notifications'

export const useGetMentionsQuery = () => {
    const { $notificationsService } = useNuxtApp()
    const query = useInfiniteQuery({
        queryKey: ['mentions'],
        queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
            $notificationsService.getMentions(pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage.has_next ? lastPage.page + 1 : undefined
        },
        initialPageParam: 1,
    })

    const mentions = computed<ApiMentions[]>(() => {
        console.log('mentions', query.data.value?.pages)
        return query.data.value?.pages.flatMap((page: MentionsApiData) => page.notifications) ?? []
    })

    return {
        mentions,
        isLoadingMentions: query.isLoading,
        isErrorMentions: query.isError,
        isSuccessfullyMentions: query.isSuccess,
        hasNextMentions: query.hasNextPage,
        hasPreviousMentions: query.hasPreviousPage,
        isFetchingNextMentions: query.isFetchingNextPage,
        isFetchingPreviousMentions: query.isFetchingPreviousPage,
        fetchNextMentions: query.fetchNextPage,
        fetchPreviousMentions: query.fetchPreviousPage,
        refetchMentions: query.refetch,
    }
}
