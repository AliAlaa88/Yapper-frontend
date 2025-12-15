import type { Socket } from 'socket.io-client'
import { ref } from 'vue'
import { useUserStore } from '~/modules/auth/stores/userStore'

export const createSocketService = () => {
    const { $socket } = useNuxtApp()
    let socket: Socket | null = null
    const connected = ref(false)

    const connect = () => {
        const userStore = useUserStore()
        const token = userStore.getAccessToken()

        if (!token) {
            throw new Error('Cannot connect: access token not available')
        }

        if (socket) {
            socket.removeAllListeners()
            socket.disconnect()
            socket = null
        }

        socket = $socket.create()
        connected.value = false

        socket.connect()

        socket.on('connect', () => {
            connected.value = true
            console.log('[SocketService] Connected to server')
        })

        socket.on('disconnect', (reason: string) => {
            connected.value = false
            console.log('[SocketService] Disconnected:', reason)
        })

        socket.on('connect_error', (error: Error) => {
            connected.value = false
            console.error('[SocketService] Connection error:', error.message)
        })
    }

    const disconnect = () => {
        if (socket) {
            socket.removeAllListeners()
            socket.disconnect()
            socket = null
        }
        connected.value = false
    }

    const emit = (event: string, ...args: any[]) => {
        if (!socket || !socket.connected) {
            console.warn(`[SocketService] Cannot emit "${event}": socket not connected`)
            return
        }
        socket.emit(event, ...args)
    }

    const on = (event: string, callback: (...args: any[]) => void) => {
        if (!socket) {
            console.warn(
                `[SocketService] Cannot add listener "${event}": socket not initialized. Call connect() first.`,
            )
            return
        }
        socket.on(event, callback)
        console.log(`[SocketService] Listener registered: ${event}`)
    }

    const off = (event: string, callback?: (...args: any[]) => void) => {
        if (!socket) return
        socket.off(event, callback)
    }

    const once = (event: string, callback: (...args: any[]) => void) => {
        if (!socket) {
            console.warn(
                `[SocketService] Cannot add once listener "${event}": socket not initialized`,
            )
            return
        }
        socket.once(event, callback)
    }

    const isConnected = (): boolean => {
        return connected.value
    }

    const getSocket = (): Socket | null => socket

    return {
        connect,
        disconnect,
        emit,
        on,
        off,
        once,
        isConnected,
        getSocket,
        connected,
    }
}
