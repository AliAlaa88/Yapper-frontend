import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { MessagesPage } from '../../types'

// Create mock functions first
const mockGetMessages = vi.fn()
const mockUseInfiniteQuery = vi.fn()

// Mock modules before imports
vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $chatService: {
            getMessages: mockGetMessages,
        },
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: (options: any) => mockUseInfiniteQuery(options),
}))

// Import after mocks are set up
const { useMessagesQuery } = await import('../../queries/useMessagesQuery')

describe('useMessagesQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create infinite query with correct query key', () => {
        const chatId = ref('chat-123')

        useMessagesQuery(chatId)

        expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['messages', chatId],
            }),
        )
    })

    it('should accept string as chatId', () => {
        const chatId = 'chat-456'

        useMessagesQuery(chatId)

        expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['messages', chatId],
            }),
        )
    })

    it('should accept undefined chatId', () => {
        const chatId = ref(undefined)

        useMessagesQuery(chatId)

        expect(mockUseInfiniteQuery).toHaveBeenCalled()
    })

    describe('queryFn', () => {
        it('should have queryFn defined in options', () => {
            const chatId = 'chat-123'

            let capturedOptions: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedOptions = options
                return {}
            })

            useMessagesQuery(chatId)

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

            useMessagesQuery('chat-123')

            const lastPage: MessagesPage = {
                chatId: 'chat-123',
                messages: [],
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

            useMessagesQuery('chat-123')

            const lastPage: MessagesPage = {
                chatId: 'chat-123',
                messages: [],
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

            useMessagesQuery('chat-123')

            const lastPage: MessagesPage = {
                chatId: 'chat-123',
                messages: [],
                nextCursor: null,
                hasMore: false,
            }

            const result = capturedGetNextPageParam(lastPage)

            expect(result).toBeUndefined()
        })
    })

    describe('enabled', () => {
        it('should be enabled when chatId is provided', () => {
            const chatId = ref('chat-123')

            let capturedEnabled: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedEnabled = options.enabled
                return {}
            })

            useMessagesQuery(chatId)

            const result = capturedEnabled()

            expect(result).toBe(true)
        })

        it('should be disabled when chatId is undefined', () => {
            const chatId = ref(undefined)

            let capturedEnabled: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedEnabled = options.enabled
                return {}
            })

            useMessagesQuery(chatId)

            const result = capturedEnabled()

            expect(result).toBe(false)
        })

        it('should be disabled when chatId is empty string', () => {
            const chatId = ref('')

            let capturedEnabled: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedEnabled = options.enabled
                return {}
            })

            useMessagesQuery(chatId)

            const result = capturedEnabled()

            expect(result).toBe(false)
        })

        it('should react to chatId changes', () => {
            const chatId = ref('')

            let capturedEnabled: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedEnabled = options.enabled
                return {}
            })

            useMessagesQuery(chatId)

            expect(capturedEnabled()).toBe(false)

            // Change chatId
            chatId.value = 'chat-123'

            expect(capturedEnabled()).toBe(true)
        })
    })

    describe('initialPageParam', () => {
        it('should set initialPageParam to undefined', () => {
            let capturedInitialPageParam: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedInitialPageParam = options.initialPageParam
                return {}
            })

            useMessagesQuery('chat-123')

            expect(capturedInitialPageParam).toBeUndefined()
        })
    })

    describe('integration behavior', () => {
        it('should configure infinite query correctly', () => {
            const chatId = 'chat-123'

            let capturedOptions: any

            mockUseInfiniteQuery.mockImplementation((options) => {
                capturedOptions = options
                return {}
            })

            useMessagesQuery(chatId)

            // Verify all required options are set
            expect(capturedOptions.queryKey).toEqual(['messages', chatId])
            expect(capturedOptions.queryFn).toBeDefined()
            expect(capturedOptions.getNextPageParam).toBeDefined()
            expect(capturedOptions.enabled).toBeDefined()
            expect(capturedOptions.initialPageParam).toBeUndefined()
        })
    })
})
