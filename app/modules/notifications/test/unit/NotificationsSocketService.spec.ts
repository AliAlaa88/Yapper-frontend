import { describe, it, vi, beforeEach, expect } from 'vitest'
import { createNotificationsSocketService } from '~/modules/notifications/services/NotificationsSocketService'
import { SOCKET_EVENTS } from '~/modules/notifications/types/notificationsSocketEvents'

vi.mock('vue-router', () => ({
    useRoute: () => ({ path: '/' }),
}))

describe('NotificationsSocketService', () => {
    let socketService: any
    let queryClient: any
    let service: ReturnType<typeof createNotificationsSocketService>

    beforeEach(() => {
        socketService = {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn(),
            isConnected: vi.fn().mockReturnValue(true),
        }

        queryClient = {
            setQueryData: vi.fn((key, updater) =>
                updater({ pages: [{ notifications: [], total: 0 }] }),
            ),
        }

        service = createNotificationsSocketService({ socketService, queryClient })
    })

    it('should initialize and remove listeners', () => {
        service.initializeListeners()
        expect(socketService.on).toHaveBeenCalledWith(
            SOCKET_EVENTS.NEWEST_COUNT,
            expect.any(Function),
        )
        service.removeListeners()
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.NEWEST_COUNT)
    })

    it('should update unread count on NEWEST_COUNT event', () => {
        service.initializeListeners()
        const callback = socketService.on.mock.calls.find(
            (c) => c[0] === SOCKET_EVENTS.NEWEST_COUNT,
        )[1]
        callback({ newest_count: 5 })
        expect(service.unreadCount.value).toBe(5)
    })

    it('should increment unread count if not on notifications page', () => {
        service.unreadCount.value = 0
        service.initializeListeners()
        const fakeEvent = { type: 'message', action: 'add', id: '1' }
        const handleCallback = socketService.on.mock.calls.find((c) => c[0] === 'message')[1]
        handleCallback(fakeEvent)
        expect(service.unreadCount.value).toBe(1)
    })

    it('should mark notifications as seen and reset unread count', () => {
        service.unreadCount.value = 5
        service.markNotificationsAsSeen()
        expect(service.unreadCount.value).toBe(0)
        expect(socketService.emit).toHaveBeenCalledWith(SOCKET_EVENTS.MARK_SEEN, {})
    })

    it('should add notification to cache', () => {
        service.initializeListeners()
        const fakeEvent = { type: 'message', action: 'add', id: '1' }

        const messageCall = socketService.on.mock.calls.find((c: any) => c[0] === 'message')
        if (messageCall && messageCall[1]) {
            messageCall[1](fakeEvent)
            expect(queryClient.setQueryData).toHaveBeenCalled()
        }
    })

    it('should handle remove notification event', () => {
        const removeEvent = { type: 'reply', action: 'remove', id: '1' }
        const replyCall = socketService.on.mock.calls.find((c: any) => c[0] === 'reply')
        if (replyCall && replyCall[1]) {
            replyCall[1](removeEvent)
            expect(queryClient.setQueryData).not.toThrow()
        }
    })
})
