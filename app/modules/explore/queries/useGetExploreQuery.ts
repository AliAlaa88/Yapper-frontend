import { useNuxtApp } from '#app'
import { useQuery } from '@tanstack/vue-query'
import { watch, type Ref } from 'vue'

export function useGetExploreQuery(
    enabled: Ref<boolean> | boolean = false,
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $exploreService } = useNuxtApp()
    const query = useQuery({
        queryKey: ['getExplore'],
        queryFn: () => $exploreService.getExplore(),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    // Watch for data changes and call onSuccess
    if (onSuccess) {
        watch(
            () => query.data.value,
            (newData) => {
                if (newData) {
                    onSuccess(newData)
                }
            },
            { immediate: true },
        )
    }
    // Watch for error changes and call onError
    if (onError) {
        watch(
            () => query.error.value,
            (newError) => {
                if (newError) {
                    onError(newError)
                }
            },
        )
    }
    return query
}

export function useGetTrendsQuery(category?: String, enabled: Ref<boolean> | boolean = false) {
    const { $exploreService } = useNuxtApp()

    const query = useQuery({
        queryKey: ['getTrends', category],
        queryFn: () => $exploreService.getTrending(category),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })

    return query
}

export function useGetExploreCategoriesQuery(
    category?: String,
    enabled: Ref<boolean> | boolean = false,
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $exploreService } = useNuxtApp()
    const query = useQuery({
        queryKey: ['getExploreCategories', category],
        queryFn: () => $exploreService.getExploreCategories(category),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    // Watch for data changes and call onSuccess
    if (onSuccess) {
        watch(
            () => query.data.value,
            (newData) => {
                if (newData) {
                    onSuccess(newData)
                }
            },
            { immediate: true },
        )
    }
    // Watch for error changes and call onError
    if (onError) {
        watch(
            () => query.error.value,
            (newError) => {
                if (newError) {
                    onError(newError)
                }
            },
        )
    }
    return query
}
