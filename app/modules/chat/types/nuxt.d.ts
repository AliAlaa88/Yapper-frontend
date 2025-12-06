import type { ChatSocketService } from '../services/ChatSocketService'
import type { createChatService } from '../services/chatServices'

declare module '#app' {
    interface NuxtApp {
        $chatSocketService: ChatSocketService
        $chatService: ReturnType<typeof createChatService>
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $chatSocketService: ChatSocketService
        $chatService: ReturnType<typeof createChatService>
    }
}
