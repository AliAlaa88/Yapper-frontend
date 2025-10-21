import type { createAuthService } from '../modules/profile/services'

declare module '#app' {
    interface NuxtApp {
        $authService: createAuthService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $authService: createAuthService
    }
}
