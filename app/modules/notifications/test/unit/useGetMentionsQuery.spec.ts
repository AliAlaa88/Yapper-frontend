import { describe, it, vi, beforeEach, expect } from 'vitest'
import { ref } from 'vue'
import { useGetMentionsQuery } from '~/modules/notifications/queries/useGetMentionsQuery'
import { useInfiniteQuery } from '@tanstack/vue-query'

const mockUseNuxtApp = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: mockUseNuxtApp,
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
            recaptcha: 'test-key',
        },
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: vi.fn(),
}))

describe('useGetMentionsQuery', () => {
    const mockGetMentions = vi.fn()
    const mockQueryData = ref({ pages: [{ notifications: [{ id: '1' }] }] })
    const mockQuery = {
        data: mockQueryData,
        isLoading: ref(false),
        isError: ref(false),
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
        mockGetMentions.mockReset()

        mockUseNuxtApp.mockReturnValue({
            $notificationsService: { getMentions: mockGetMentions },
        })
        ;(useInfiniteQuery as any).mockReturnValue(mockQuery)
    })

    it('should call getMentions with default page param and compute mentions', () => {
        const { mentions } = useGetMentionsQuery()
        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['mentions'],
                queryFn: expect.any(Function),
                getNextPageParam: expect.any(Function),
                initialPageParam: 1,
            }),
        )
        expect(mentions.value).toEqual([{ id: '1' }])
    })

    it('should handle empty pages correctly', () => {
        mockQuery.data.value = { pages: [] }
        const { mentions } = useGetMentionsQuery()
        expect(mentions.value).toEqual([])
    })

    it('should expose reactive properties from useInfiniteQuery', () => {
        const result = useGetMentionsQuery()
        expect(result.isLoadingMentions.value).toBe(false)
        expect(result.isErrorMentions.value).toBe(false)
        expect(result.isSuccessfullyMentions.value).toBe(true)
        expect(result.hasNextMentions.value).toBe(true)
        expect(result.hasPreviousMentions.value).toBe(false)
        expect(result.isFetchingNextMentions.value).toBe(false)
        expect(result.isFetchingPreviousMentions.value).toBe(false)
        expect(typeof result.fetchNextMentions).toBe('function')
        expect(typeof result.fetchPreviousMentions).toBe('function')
        expect(typeof result.refetchMentions).toBe('function')
    })

    it('should call getNextPageParam with correct logic', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        useGetMentionsQuery()
        const call = (useInfiniteQuery as any).mock.calls[0][0]
        const getNextPageParam = call.getNextPageParam

        const pageWithNext = { has_next: true, page: 1, notifications: [] }
        expect(getNextPageParam(pageWithNext)).toBe(2)

        const pageWithoutNext = { has_next: false, page: 2, notifications: [] }
        expect(getNextPageParam(pageWithoutNext)).toBeUndefined()

        consoleSpy.mockRestore()
    })

    it('should handle multiple pages correctly', () => {
        const multiPageData = ref({
            pages: [
                { notifications: [{ id: '1' }] },
                { notifications: [{ id: '2' }] },
                { notifications: [{ id: '3' }] },
            ],
        })
        mockQuery.data.value = multiPageData.value
        const { mentions } = useGetMentionsQuery()
        expect(mentions.value).toHaveLength(3)
        expect(mentions.value).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }])
    })
})
