import type { settingsService } from './settingsService.real'

declare module '#app' {
    interface NuxtApp {
        $settingsService: settingsService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $settingsService: settingsService
    }
}
