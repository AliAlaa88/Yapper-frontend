import { useNuxtApp } from '#app'
import { useQuery } from '@tanstack/vue-query'
import { watch, type Ref } from 'vue'

export function useGetExploreQuery(enabled: Ref<boolean> | boolean = false) {
    const { $exploreService } = useNuxtApp()
    const query = useQuery({
        queryKey: ['getExplore'],
        queryFn: () => $exploreService.getExplore(),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    return query
}

export function useGetTrendsQuery(
    category?: String,
    enabled: Ref<boolean> | boolean = false,
    limit?: number,
) {
    const { $exploreService } = useNuxtApp()

    const query = useQuery({
        queryKey: ['getTrends', category],
        queryFn: () => $exploreService.getTrending(category, limit),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    return query
}

export function useGetWhoToFollowQuery(enabled: Ref<boolean> | boolean = false) {
    const { $exploreService } = useNuxtApp()
    const query = useQuery({
        queryKey: ['who-to-follow'],
        queryFn: () => $exploreService.getExploreWhoToFollow(),
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    return query
}

export function useGetExploreCategoriesQuery(
    category_id: Ref<string> | string,
    page: Ref<number> | number = 1,
    limit: Ref<number> | number = 20,
    enabled: Ref<boolean> | boolean = false,
) {
    const { $exploreService } = useNuxtApp()
    const query = useQuery({
        queryKey: ['getExploreCategories', category_id, page, limit],
        queryFn: () => {
            const catId = typeof category_id === 'string' ? category_id : category_id.value
            const pageNum = typeof page === 'number' ? page : page.value
            const limitNum = typeof limit === 'number' ? limit : limit.value
            return $exploreService.getExploreCategories(catId, pageNum, limitNum)
        },
        enabled,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
    })
    return query
}
