import type { exploreService } from '../services/index.ts'

declare module '#app' {
    interface NuxtApp {
        $exploreService: exploreService
    }
}
declare module 'vue' {
    interface ComponentCustomProperties {
        $exploreService: exploreService
    }
}