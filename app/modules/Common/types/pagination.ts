import type { ComputedRef, MaybeRef, Ref } from 'vue'

export interface Page<T> {
    data: T[]
    nextCursor?: string
    hasMore?: boolean
}

export interface InfiniteQueryOptions<TPage, TItem> {
    queryKey: MaybeRef<readonly unknown[]>
    queryFn: (context: { pageParam: string }) => Promise<TPage>
    getNextPageParam: (lastPage: TPage) => string | undefined
    getPageData: (page: TPage) => TItem[]
    initialPageParam?: string
    staleTime?: number
    gcTime?: number
    enabled?: MaybeRef<boolean>
}

export interface InfiniteQueryResult<TItem> {
    items: ComputedRef<TItem[]>
    isPending: Ref<boolean>
    isFetching: Ref<boolean>
    isFetchingNextPage: Ref<boolean>
    error: Ref<Error | null>
    hasNextPage: Ref<boolean>
    refetch: () => void
    fetchNextPage: () => void
    loadMoreTrigger: Ref<HTMLElement | null>
}
