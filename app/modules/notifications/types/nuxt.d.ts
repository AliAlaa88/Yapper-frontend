
import type { notificationsService } from '../services/notificationsService'

declare module '#app' {
    interface NuxtApp {
        $notificationsService: notificationsService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $notificationsService: notificationsService
    }
}
