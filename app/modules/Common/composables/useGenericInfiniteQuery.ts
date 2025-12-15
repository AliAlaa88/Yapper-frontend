import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed, toRef, unref, type MaybeRef } from 'vue'
import { useInfiniteScroll } from './useInfiniteScroll'
import type { InfiniteQueryOptions, InfiniteQueryResult } from '../types/pagination'

export function useGenericInfiniteQuery<TPage, TItem>(
    options: InfiniteQueryOptions<TPage, TItem>,
): InfiniteQueryResult<TItem> {
    const {
        queryKey,
        queryFn,
        getNextPageParam,
        getPageData,
        initialPageParam = '',
        staleTime = 1000 * 60 * 5, // 5 minutes
        gcTime = 1000 * 60 * 10, // 10 minutes
        enabled,
    } = options

    const query = useInfiniteQuery<TPage>({
        queryKey:
            typeof queryKey === 'function' || 'value' in queryKey
                ? queryKey
                : toRef(() => queryKey),
        queryFn: ({ pageParam = initialPageParam }) => queryFn({ pageParam: pageParam as string }),
        getNextPageParam: (lastPage) => getNextPageParam(lastPage) ?? undefined,
        initialPageParam,
        staleTime,
        gcTime,
        enabled: enabled !== undefined ? toRef(() => unref(enabled)) : undefined,
    })

    const items = computed<TItem[]>(() => {
        const pages = query.data.value?.pages
        if (!pages) return []
        return pages.flatMap((page) => getPageData(page))
    })

    const { loadMoreTrigger } = useInfiniteScroll({
        hasNextPage: computed(() => query.hasNextPage.value ?? false),
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: () => query.fetchNextPage(),
    })

    return {
        items,
        isPending: query.isPending,
        isFetching: query.isFetching,
        isFetchingNextPage: query.isFetchingNextPage,
        error: query.error as any,
        hasNextPage: computed(() => query.hasNextPage.value ?? false) as any,
        refetch: () => query.refetch(),
        fetchNextPage: () => query.fetchNextPage(),
        loadMoreTrigger,
    }
}
