import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const socket = io(`${config.public.apiUrl}/messages`, {
        autoConnect: false,
    })

    return {
        provide: {
            socket,
        },
    }
})
