export const createSocketService = () => {
    const { $socket } = useNuxtApp()

    // Force socket creation immediately when service is created
    const socket = $socket.create()

    const connect = () => {
        socket.connect()

        socket.on('connect', () => {
            console.log('[SocketService] Connected to server')
        })

        socket.on('disconnect', (reason: string) => {
            console.log('[SocketService] Disconnected:', reason)
        })

        socket.on('connect_error', (error: Error) => {
            console.error('[SocketService] Connection error:', error.message)
        })
    }

    const disconnect = () => {
        socket.disconnect()
    }

    const emit = (event: string, ...args: any[]) => {
        if (socket.connected) {
            socket.emit(event, ...args)
        } else {
            console.warn('[SocketService] Cannot emit, not connected')
        }
    }

    const on = (event: string, callback: (...args: any[]) => void) => {
        socket.on(event, callback)
        console.log(`[SocketService] Listener registered: ${event}`)
    }

    const off = (event: string, callback?: (...args: any[]) => void) => {
        socket.off(event, callback)
    }

    const once = (event: string, callback: (...args: any[]) => void) => {
        socket.once(event, callback)
    }

    const isConnected = (): boolean => {
        return socket.connected
    }

    return {
        connect,
        disconnect,
        emit,
        on,
        off,
        once,
        isConnected,
    }
}
