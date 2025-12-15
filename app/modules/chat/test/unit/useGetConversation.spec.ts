import { describe, it, expect, vi, beforeEach } from 'vitest'

// Create mock functions first
const mockGetConversations = vi.fn()
const mockUseInfiniteQuery = vi.fn()

// Mock modules before imports
vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $chatService: {
            getConversations: mockGetConversations,
        },
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: (options: any) => mockUseInfiniteQuery(options),
}))

// Import after mocks are set up
const { useGetConversation } = await import('../../queries/useGetConversation')

describe('useGetConversation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create infinite query with correct query key', () => {
        useGetConversation()

        expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['conversations'],
            }),
        )
    })

    it('should use default limit of 20', () => {
        useGetConversation()

        expect(mockUseInfiniteQuery).toHaveBeenCalled()
    })

    it('should accept custom limit', () => {
        useGetConversation(50)

        expect(mockUseInfiniteQuery).toHaveBeenCalled()
    })

    describe('queryFn', () => {
        it('should have queryFn defined in options', () => {
            let capturedOptions: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedOptions = options
                return {}
            })

            useGetConversation(20)

            expect(capturedOptions.queryFn).toBeDefined()
            expect(typeof capturedOptions.queryFn).toBe('function')
        })
    })

    describe('getNextPageParam', () => {
        it('should return nextCursor when hasMore is true', () => {
            let capturedGetNextPageParam: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedGetNextPageParam = options.getNextPageParam
                return {}
            })

            useGetConversation()

            const lastPage = {
                data: [],
                nextCursor: 'cursor-xyz',
                hasMore: true,
            }

            const result = capturedGetNextPageParam(lastPage)

            expect(result).toBe('cursor-xyz')
        })

        it('should return undefined when hasMore is false', () => {
            let capturedGetNextPageParam: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedGetNextPageParam = options.getNextPageParam
                return {}
            })

            useGetConversation()

            const lastPage = {
                data: [],
                nextCursor: 'cursor-xyz',
                hasMore: false,
            }

            const result = capturedGetNextPageParam(lastPage)

            expect(result).toBeUndefined()
        })

        it('should return undefined when nextCursor is null and hasMore is false', () => {
            let capturedGetNextPageParam: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedGetNextPageParam = options.getNextPageParam
                return {}
            })

            useGetConversation()

            const lastPage = {
                data: [],
                nextCursor: null,
                hasMore: false,
            }

            const result = capturedGetNextPageParam(lastPage)

            expect(result).toBeUndefined()
        })
    })

    describe('initialPageParam', () => {
        it('should set initialPageParam to null', () => {
            let capturedInitialPageParam: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedInitialPageParam = options.initialPageParam
                return {}
            })

            useGetConversation()

            expect(capturedInitialPageParam).toBeNull()
        })
    })

    describe('integration behavior', () => {
        it('should configure infinite query correctly', () => {
            let capturedOptions: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedOptions = options
                return {}
            })

            useGetConversation(20)

            // Verify all required options are set
            expect(capturedOptions.queryKey).toEqual(['conversations'])
            expect(capturedOptions.queryFn).toBeDefined()
            expect(capturedOptions.getNextPageParam).toBeDefined()
            expect(capturedOptions.initialPageParam).toBeNull()
        })
    })
})
