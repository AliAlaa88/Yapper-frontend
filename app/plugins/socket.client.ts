import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
    let socket: Socket | null = null
    const config = useRuntimeConfig()
    const createSocket = (): Socket => {
        // Disconnect existing socket if any
        if (socket) {
            socket.disconnect()
        }

        // Get token from cookie
        const tokenCookie = useCookie('access_token')
        const token = tokenCookie.value
        socket = io(`${config.public.socketUrl as string}/messages`, {
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
