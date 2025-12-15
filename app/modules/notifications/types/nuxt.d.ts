import type { NotificationsSocketService } from '../services/NotificationsSocketService'
import type { notificationsService } from '../services/notificationsService'

declare module '#app' {
    interface NuxtApp {
        $notificationsService: notificationsService
        $notificationsSocketService: NotificationsSocketService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $notificationsService: notificationsService
        $notificationsSocketService: NotificationsSocketService
    }
}
