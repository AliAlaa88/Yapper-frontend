import type { ChatSocketService } from '../services/ChatSocketService'

declare module '#app' {
    interface NuxtApp {
        $chatSocketService: ChatSocketService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $chatSocketService: ChatSocketService
    }
}
