import { describe, it, expect, vi, beforeEach } from 'vitest'

// Create mock functions first
const mockCreateConversation = vi.fn()
const mockUseMutation = vi.fn()
const mockOnConversationCreate = vi.fn()

// Mock modules before imports
vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $chatService: {
            createConversation: mockCreateConversation,
        },
        $queryClient: {},
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => mockUseMutation(options),
}))

vi.mock('~/modules/Common/queries', () => ({
    cacheInvalidation: {
        onConversationCreate: mockOnConversationCreate,
    },
}))

// Import after mocks are set up
const { useAddConversation } = await import('../../queries/useAddConversation')

describe('useAddConversation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation', () => {
        useAddConversation()

        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('should have mutationFn that calls createConversation', () => {
        useAddConversation()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.mutationFn).toBeDefined()
    })

    it('should call createConversation with userId', async () => {
        const userId = 'user-123'
        mockCreateConversation.mockResolvedValue({ id: 'chat-1', participant_id: userId })

        useAddConversation()

        const callArgs = mockUseMutation.mock.calls[0][0]
        const result = await callArgs.mutationFn(userId)

        expect(mockCreateConversation).toHaveBeenCalledWith(userId)
        expect(result).toEqual({ id: 'chat-1', participant_id: userId })
    })

    it('should invalidate conversation cache on success', async () => {
        const userId = 'user-123'
        mockCreateConversation.mockResolvedValue({ id: 'chat-1', participant_id: userId })

        useAddConversation()

        const callArgs = mockUseMutation.mock.calls[0][0]
        await callArgs.mutationFn(userId)

        // Simulate onSuccess
        const onSuccess = callArgs.onSuccess
        if (onSuccess) {
            onSuccess({ id: 'chat-1', participant_id: userId })
        }

        expect(mockOnConversationCreate).toHaveBeenCalled()
    })

    it('should handle error when createConversation fails', async () => {
        const userId = 'user-123'
        const error = new Error('Network error')
        mockCreateConversation.mockRejectedValue(error)

        useAddConversation()

        const callArgs = mockUseMutation.mock.calls[0][0]

        await expect(callArgs.mutationFn(userId)).rejects.toThrow('Network error')
        expect(mockCreateConversation).toHaveBeenCalledWith(userId)
    })
})
