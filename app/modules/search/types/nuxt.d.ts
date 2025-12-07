import type { searchServiceReal } from '../services/searchService.real'

export type SearchService = typeof searchServiceReal

declare module '#app' {
    interface NuxtApp {
        $searchService: SearchService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $searchService: SearchService
    }
}
