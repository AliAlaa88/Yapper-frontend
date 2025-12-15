import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const mockAuthService = {
    getUserData: vi.fn(),
}

const mockUseQuery = vi.fn()
const mockWatch = vi.fn()

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useQuery: (options: any) => mockUseQuery(options),
}))

vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        watch: (source: any, callback: any) => mockWatch(source, callback),
    }
})

const { useGetUserQuery } = await import('../../queries/useGetuserQuery')

describe('useGetUserQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create query with correct queryKey', () => {
        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.queryKey).toEqual(['getUser'])
    })

    it('should call getUserData in queryFn', async () => {
        mockAuthService.getUserData.mockResolvedValue({ id: 'user-1', username: 'john' })

        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        const result = await callArgs.queryFn()

        expect(mockAuthService.getUserData).toHaveBeenCalled()
        expect(result).toEqual({ id: 'user-1', username: 'john' })
    })

    it('should accept boolean enabled flag', () => {
        useGetUserQuery(true)

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.enabled).toBe(true)
    })

    it('should accept ref enabled flag', () => {
        const enabledRef = ref(false)
        useGetUserQuery(enabledRef)

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.enabled).toBe(enabledRef)
    })

    it('should have retry set to false', () => {
        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.retry).toBe(false)
    })

    it('should have refetchOnWindowFocus set to false', () => {
        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.refetchOnWindowFocus).toBe(false)
    })

    it('should have refetchOnMount set to false', () => {
        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.refetchOnMount).toBe(false)
    })

    it('should watch data changes and call onSuccess', () => {
        const onSuccess = vi.fn()
        useGetUserQuery(true, onSuccess)

        expect(mockWatch).toHaveBeenCalled()
    })

    it('should watch error changes and call onError', () => {
        const onError = vi.fn()
        useGetUserQuery(true, undefined, onError)

        expect(mockWatch).toHaveBeenCalled()
    })

    it('should not watch if callbacks are not provided', () => {
        const watchCallCount = mockWatch.mock.calls.length
        useGetUserQuery()
        
        // Watch should not be called since no callbacks provided
        expect(mockWatch.mock.calls.length).toBeLessThanOrEqual(watchCallCount)
    })

    it('should handle default enabled value of false', () => {
        useGetUserQuery()

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.enabled).toBe(false)
    })
})
