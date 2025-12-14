import { io, Socket } from 'socket.io-client'
import { useUserStore } from '~/modules/auth/stores/userStore'

export default defineNuxtPlugin(() => {
    let socket: Socket | null = null
    const config = useRuntimeConfig()
    const createSocket = (): Socket => {
        if (socket) {
            socket.disconnect()
        }
        const userStore = useUserStore()

        const token = userStore.getAccessToken()

        if (!token) {
            console.warn('[Socket] Creating socket without token - may fail to authenticate')
        }

        console.log('[Socket] Creating socket with token:', token ? 'present' : 'missing')

        socket = io(`${config.public.socketUrl as string}/`, {
            path: config.public.socketPath as string,
            autoConnect: false,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token,
            },
            query: {
                auth: token,
            },
        })

        return socket
    }

    const getSocket = (): Socket | null => socket

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    }

    return {
        provide: {
            socket: {
                create: createSocket,
                get: getSocket,
                disconnect: disconnectSocket,
            },
        },
    }
})
