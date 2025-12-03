import { createSocketService } from '~/modules/Common/services/socketServices'

export default defineNuxtPlugin(() => {
    const socketService = createSocketService()
    
    return {
        provide: {
            socketService,
        },
    }
})

