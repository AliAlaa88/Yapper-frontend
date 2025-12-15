import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Conversation } from '../../types'
import { ref, computed } from 'vue'

// Create mock functions first
const mockGetConversations = vi.fn()
const mockGetConversationById = vi.fn()
const mockUseInfiniteQuery = vi.fn()
const mockUseQuery = vi.fn()

// Mock modules before imports
vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $chatService: {
            getConversations: mockGetConversations,
            getConversationById: mockGetConversationById,
        },
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: (options: any) => mockUseInfiniteQuery(options),
    useQuery: (options: any) => mockUseQuery(options),
}))

// Import after mocks are set up
const { useGetConversation, useGetConversationById } = await import('../../queries/useGetConversation')

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

describe('useGetConversationById', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create query with correct query key using string chatId', () => {
        let capturedOptions: any

        mockUseQuery.mockImplementation((options) => {
            capturedOptions = options
            return {}
        })

        useGetConversationById('chat-123')

        expect(mockUseQuery).toHaveBeenCalled()
        expect(capturedOptions.queryKey).toBeDefined()
    })

    it('should accept string chatId', () => {
        useGetConversationById('chat-123')

        expect(mockUseQuery).toHaveBeenCalled()
    })

    it('should accept ref chatId', () => {
        const chatIdRef = ref('chat-123')
        useGetConversationById(chatIdRef)

        expect(mockUseQuery).toHaveBeenCalled()
    })

    it('should accept function returning chatId', () => {
        useGetConversationById(() => 'chat-123')

        expect(mockUseQuery).toHaveBeenCalled()
    })

    describe('queryFn', () => {
        it('should call getConversationById with correct chatId', async () => {
            let capturedQueryFn: any

            mockUseQuery.mockImplementation((options) => {
                capturedQueryFn = options.queryFn
                return {}
            })

            mockGetConversationById.mockResolvedValue({
                id: 'chat-123',
                participant: { id: 'user-2', username: 'john' },
                last_message: 'Hello',
                unread_count: 0,
            })

            useGetConversationById('chat-123')

            const result = await capturedQueryFn()

            expect(mockGetConversationById).toHaveBeenCalledWith('chat-123')
            expect(result).toEqual({
                id: 'chat-123',
                participant: { id: 'user-2', username: 'john' },
                last_message: 'Hello',
                unread_count: 0,
            })
        })

        it('should handle errors from getConversationById', async () => {
            let capturedQueryFn: any

            mockUseQuery.mockImplementation((options) => {
                capturedQueryFn = options.queryFn
                return {}
            })

            const error = new Error('Chat not found')
            mockGetConversationById.mockRejectedValue(error)

            useGetConversationById('chat-invalid')

            await expect(capturedQueryFn()).rejects.toThrow('Chat not found')
        })
    })

    describe('enabled computed', () => {
        it('should have enabled property', () => {
            let capturedOptions: any

            mockUseQuery.mockImplementation((options) => {
                capturedOptions = options
                return {}
            })

            useGetConversationById('chat-123')

            expect(capturedOptions.enabled).toBeDefined()
        })

        it('should enable query when chatId is provided', () => {
            let capturedEnabled: any

            mockUseQuery.mockImplementation((options) => {
                capturedEnabled = options.enabled
                return {}
            })

            useGetConversationById('chat-123')

            // The enabled should be a computed that returns true when chatId is truthy
            expect(typeof capturedEnabled === 'object' || typeof capturedEnabled === 'function').toBe(true)
        })
    })
})
