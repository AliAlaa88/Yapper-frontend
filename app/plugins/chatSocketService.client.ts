import { createChatSocketService } from '~/modules/chat/services/ChatSocketService'
import type { QueryClient } from '@tanstack/vue-query'
import type { createSocketService } from '~/modules/Common/services/socketServices'

type SocketService = ReturnType<typeof createSocketService>

export default defineNuxtPlugin({
    name: 'chatSocketService',
    dependsOn: ['socketService'],
    setup(nuxtApp) {
        const socketService = nuxtApp.$socketService as SocketService
        const queryClient = nuxtApp.$queryClient as QueryClient

        const chatSocketService = createChatSocketService({
            socketService,
            queryClient,
        })

        return {
            provide: {
                chatSocketService,
            },
        }
    },
})
