export const createSocketService = () => {
    const socket = useNuxtApp().$socket

    const connect = () => {
        socket.connect()
    }

    const disconnect = () => {
        socket.disconnect()
    }
    // send event to the server
    const emit = (event: string, ...args: any[]) => {
        socket.emit(event, ...args)
    }

    // listen to an event from the server
    const on = (event: string, callback: (...args: any[]) => void) => {
        socket.on(event, callback)
    }

    return {
        connect,
        disconnect,
        emit,
        on,
    }
}

export default createSocketService
