import { createNotificationsSocketService } from '~/modules/notifications/services/NotificationsSocketService'
import type { QueryClient } from '@tanstack/vue-query'
import type { createSocketService } from '~/modules/Common/services/socketServices'

type SocketService = ReturnType<typeof createSocketService>

export default defineNuxtPlugin({
    name: 'notificationsSocketService',
    dependsOn: ['socketService'],
    setup(nuxtApp) {
        const socketService = nuxtApp.$socketService as SocketService
        const queryClient = nuxtApp.$queryClient as QueryClient

        if (!socketService) {
            throw new Error('Socket service is required for notification socket service')
        }

        if (!queryClient) {
            throw new Error('Query client is required for notification socket service')
        }

        const notificationsSocketService = createNotificationsSocketService({
            socketService,
            queryClient,
        })

        return {
            provide: {
                notificationsSocketService,
            },
        }
    },
})
