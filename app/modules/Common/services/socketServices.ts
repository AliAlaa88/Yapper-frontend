import type { Socket } from 'socket.io-client'
import { useUserStore } from '~/modules/auth/stores/userStore'
export const createSocketService = () => {
    const { $socket } = useNuxtApp()
    let socket: Socket | null = null

    const ensureSocket = (): Socket => {
        if (socket && (socket.connected || socket.active)) {
            return socket
        }

        const userStore = useUserStore()
        const token = userStore.getAccessToken()

        if (!token) {
            throw new Error('Cannot create socket: access token not available')
        }

        if (socket) {
            socket.removeAllListeners()
            socket.disconnect()
        }

        socket = $socket.create()
        return socket
    }

    const connect = () => {
        try {
            const currentSocket = ensureSocket()
            currentSocket.connect()

            currentSocket.on('connect', () => {
                console.log('[SocketService] Connected to server')
            })

            currentSocket.on('disconnect', (reason: string) => {
                console.log('[SocketService] Disconnected:', reason)
            })

            currentSocket.on('connect_error', (error: Error) => {
                console.error('[SocketService] Connection error:', error.message)
            })
        } catch (error) {
            console.error('[SocketService] Failed to connect:', error)
            throw error
        }
    }

    const disconnect = () => {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    }

    const emit = (event: string, ...args: any[]) => {
        if (socket?.connected) {
            socket.emit(event, ...args)
        } else {
            console.warn('[SocketService] Cannot emit, not connected')
        }
    }

    const on = (event: string, callback: (...args: any[]) => void) => {
        if (!socket) {
            console.warn(
                '[SocketService] Socket not initialized, listener will be added on connect',
            )

            try {
                ensureSocket()
            } catch (error) {
                console.warn(
                    '[SocketService] Cannot initialize socket for listener, will be added when socket connects',
                )
            }
        }
        if (socket) {
            socket.on(event, callback)
            console.log(`[SocketService] Listener registered: ${event}`)
        }
    }

    const off = (event: string, callback?: (...args: any[]) => void) => {
        socket?.off(event, callback)
    }

    const once = (event: string, callback: (...args: any[]) => void) => {
        if (!socket) {
            try {
                ensureSocket()
            } catch (error) {
                console.warn('[SocketService] Cannot initialize socket for once listener')
                return
            }
        }
        if (socket) {
            socket.once(event, callback)
        }
    }

    const isConnected = (): boolean => {
        return socket?.connected ?? false
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
    }
}
