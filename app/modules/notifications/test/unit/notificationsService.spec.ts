import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createNotificationsService } from '~/modules/notifications/services/notificationsService'
import { useNuxtApp } from 'nuxt/app'

vi.mock('nuxt/app', () => ({
    useNuxtApp: vi.fn(),
}))

describe('notificationsService', () => {
    let service: ReturnType<typeof createNotificationsService>
    const mockGet = vi.fn()

    beforeEach(() => {
        mockGet.mockReset()
        ;(useNuxtApp as any).mockReturnValue({
            $axios: {
                get: mockGet,
            },
        })
        service = createNotificationsService()
    })

    it('should fetch notifications successfully', async () => {
        const data = { data: [{ id: 1 }], meta: {} }
        mockGet.mockResolvedValueOnce({ data: { data } })

        const result = await service.getNotifications()
        expect(result).toEqual(data)
        expect(mockGet).toHaveBeenCalledWith('/notifications', { params: { page: 1 } })
    })

    it('should fetch mentions successfully', async () => {
        const data = { data: [{ id: 2 }], meta: {} }
        mockGet.mockResolvedValueOnce({ data: { data } })

        const result = await service.getMentions()
        expect(result).toEqual(data)
        expect(mockGet).toHaveBeenCalledWith('/notifications/mentions', { params: { page: 1 } })
    })

    it('should throw error for 401 on notifications', async () => {
        mockGet.mockRejectedValueOnce({ response: { status: 401 }, isAxiosError: true })
        await expect(service.getNotifications()).rejects.toThrow('Invalid or expired token')
    })

    it('should throw generic error for non-401 on notifications', async () => {
        mockGet.mockRejectedValueOnce({ response: { status: 500 }, isAxiosError: true })
        await expect(service.getNotifications()).rejects.toThrow('Failed to fetch notifications')
    })

    it('should throw error for 401 on mentions', async () => {
        mockGet.mockRejectedValueOnce({ response: { status: 401 }, isAxiosError: true })
        await expect(service.getMentions()).rejects.toThrow('Invalid or expired token')
    })

    it('should throw generic error for non-401 on mentions', async () => {
        mockGet.mockRejectedValueOnce({ response: { status: 500 }, isAxiosError: true })
        await expect(service.getMentions()).rejects.toThrow('Failed to fetch mentions')
    })

    it('should pass page parameter correctly', async () => {
        const data = { data: [], meta: {} }
        mockGet.mockResolvedValueOnce({ data: { data } })
        await service.getNotifications(3)
        expect(mockGet).toHaveBeenCalledWith('/notifications', { params: { page: 3 } })

        mockGet.mockResolvedValueOnce({ data: { data } })
        await service.getMentions(5)
        expect(mockGet).toHaveBeenCalledWith('/notifications/mentions', { params: { page: 5 } })
    })
})
