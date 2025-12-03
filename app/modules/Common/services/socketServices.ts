import type { Socket } from 'socket.io-client'

export const createSocketService = () => {
    const { $socket } = useNuxtApp()

    let socketInstance: Socket | null = null

    const connect = () => {
        socketInstance = $socket.create()
        socketInstance.connect()

        socketInstance.on('connect', () => {
            console.log('[SocketService] Connected to server')
        })

        socketInstance.on('disconnect', (reason: string) => {
            console.log('[SocketService] Disconnected:', reason)
        })

        socketInstance.on('connect_error', (error: Error) => {
            console.error('[SocketService] Connection error:', error.message)
        })
    }

    const disconnect = () => {
        $socket.disconnect()
        socketInstance = null
    }

    const getSocket = (): Socket | null => {
        return socketInstance || $socket.get()
    }

    // Send event to the server
    const emit = (event: string, ...args: any[]) => {
        const socket = getSocket()
        if (socket) {
            socket.emit(event, ...args)
        } else {
            console.warn('[SocketService] Cannot emit, socket not connected')
        }
    }

    // Listen to an event from the server
    const on = (event: string, callback: (...args: any[]) => void) => {
        const socket = getSocket()
        if (socket) {
            socket.on(event, callback)
        } else {
            console.warn('[SocketService] Cannot listen, socket not connected')
        }
    }

    // Remove event listener
    const off = (event: string, callback?: (...args: any[]) => void) => {
        const socket = getSocket()
        if (socket) {
            socket.off(event, callback)
        }
    }

    // Listen to an event once
    const once = (event: string, callback: (...args: any[]) => void) => {
        const socket = getSocket()
        if (socket) {
            socket.once(event, callback)
        }
    }

    const isConnected = (): boolean => {
        const socket = getSocket()
        return socket?.connected ?? false
    }

    return {
        connect,
        disconnect,
        getSocket,
        emit,
        on,
        off,
        once,
        isConnected,
    }
}

export default createSocketService
