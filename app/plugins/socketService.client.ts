import { createSocketService } from '~/modules/Common/services/socketServices'

export default defineNuxtPlugin({
    name: 'socketService',
    setup() {
        const socketService = createSocketService()
        
        return {
            provide: {
                socketService,
            },
        }
    },
})

