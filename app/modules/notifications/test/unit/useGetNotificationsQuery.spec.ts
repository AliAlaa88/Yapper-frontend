import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useGetNotificationsQuery } from '~/modules/notifications/queries/useGetNotificationsQuery'
import { useInfiniteQuery } from '@tanstack/vue-query'

const mockUseNuxtApp = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: mockUseNuxtApp,
}))

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: vi.fn(),
}))

describe('useGetNotificationsQuery', () => {
    const mockGetNotifications = vi.fn()

    const mockNotificationsPage1 = {
        notifications: [
            { id: '1', type: 'like', created_at: '2025-12-15T10:00:00Z' },
            { id: '2', type: 'follow', created_at: '2025-12-15T11:00:00Z' },
        ] as any[],
        page: 1,
        page_size: 20,
        total: 40,
        total_pages: 2,
        has_next: true,
        has_previous: false,
    }

    const mockNotificationsPage2 = {
        notifications: [
            { id: '3', type: 'repost', created_at: '2025-12-15T12:00:00Z' },
            { id: '4', type: 'message', created_at: '2025-12-15T13:00:00Z' },
        ] as any[],
        page: 2,
        page_size: 20,
        total: 40,
        total_pages: 2,
        has_next: false,
        has_previous: true,
    }

    const mockQueryData = ref({
        pages: [mockNotificationsPage1, mockNotificationsPage2],
    })

    const mockQuery = {
        data: mockQueryData,
        isLoading: ref(false),
        isFetching: ref(false),
        isError: ref(false),
        error: ref(null),
        isSuccess: ref(true),
        hasNextPage: ref(true),
        hasPreviousPage: ref(false),
        isFetchingNextPage: ref(false),
        isFetchingPreviousPage: ref(false),
        fetchNextPage: vi.fn(),
        fetchPreviousPage: vi.fn(),
        refetch: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockGetNotifications.mockReset()
        mockUseNuxtApp.mockReturnValue({
            $notificationsService: { getNotifications: mockGetNotifications },
        })
        ;(useInfiniteQuery as any).mockReturnValue(mockQuery)
        mockQueryData.value = {
            pages: [mockNotificationsPage1, mockNotificationsPage2],
        }
    })

    it('should initialize useInfiniteQuery with correct configuration', () => {
        useGetNotificationsQuery()

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['notifications'],
                queryFn: expect.any(Function),
                getNextPageParam: expect.any(Function),
                initialPageParam: 1,
            }),
        )
    })

    it('should flatten notifications from all pages and expose them', () => {
        const { notifications } = useGetNotificationsQuery()

        expect(notifications.value).toHaveLength(4)
        expect(notifications.value[0]).toEqual(mockNotificationsPage1.notifications[0])
        expect(notifications.value[3]).toEqual(mockNotificationsPage2.notifications[1])
    })

    it('should compute getNextPageParam correctly based on has_next flag', () => {
        useGetNotificationsQuery()

        const call = (useInfiniteQuery as any).mock.calls[0][0]
        const getNextPageParam = call.getNextPageParam

        expect(getNextPageParam(mockNotificationsPage1)).toBe(2)

        expect(getNextPageParam(mockNotificationsPage2)).toBeUndefined()
    })

    it('should expose all reactive query properties from useInfiniteQuery', () => {
        const result = useGetNotificationsQuery()

        expect(result.isLoadingNotifications).toBe(mockQuery.isLoading)
        expect(result.isFetchingNotifications).toBe(mockQuery.isFetching)
        expect(result.isErrorNotifications).toBe(mockQuery.isError)
        expect(result.errorNotifications).toBe(mockQuery.error)
        expect(result.isSuccessfullyNotifications).toBe(mockQuery.isSuccess)
        expect(result.hasNextNotifications).toBe(mockQuery.hasNextPage)
        expect(result.hasPreviousNotifications).toBe(mockQuery.hasPreviousPage)
        expect(result.isFetchingNextNotifications).toBe(mockQuery.isFetchingNextPage)
        expect(result.isFetchingPreviousNotifications).toBe(mockQuery.isFetchingPreviousPage)
        expect(result.fetchNextNotifications).toBe(mockQuery.fetchNextPage)
        expect(result.fetchPreviousNotifications).toBe(mockQuery.fetchPreviousPage)
        expect(result.refetchNotifications).toBe(mockQuery.refetch)
    })

    it('should handle empty pages and return empty notifications array', () => {
        mockQueryData.value = { pages: [] }

        const { notifications } = useGetNotificationsQuery()

        expect(notifications.value).toEqual([])
    })

    it('should log notifications data when computing', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        const { notifications } = useGetNotificationsQuery()
        expect(notifications.value).toHaveLength(4)
        expect(consoleSpy).toHaveBeenCalledWith('notifications', mockQueryData.value?.pages)
        consoleSpy.mockRestore()
    })

    it('should handle single page correctly', () => {
        mockQueryData.value = {
            pages: [mockNotificationsPage1],
        }
        const { notifications } = useGetNotificationsQuery()
        expect(notifications.value).toHaveLength(2)
        expect(notifications.value).toEqual(mockNotificationsPage1.notifications)
    })
})
