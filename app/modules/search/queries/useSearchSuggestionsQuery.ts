import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { SearchSuggestion } from '../types'
import { type Ref, ref } from 'vue'

export function useSearchSuggestionsQuery(query: string, enabled: Ref<boolean> = ref(true)) {
    const { $searchService } = useNuxtApp()

    const searchSuggestionsQuery = useQuery<SearchSuggestion>({
        queryKey: ['search-suggestions', query],
        queryFn: () => $searchService.getSearchSuggestions(query),
        enabled,
    })

    return searchSuggestionsQuery
}
