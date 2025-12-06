import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createChatService } from '../../services/chatServices'

// Mock $axios before importing the service
const mockAxiosGet = vi.fn()
const mockAxiosPost = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $axios: {
            get: mockAxiosGet,
            post: mockAxiosPost,
        },
    }),
}))

// Mock axios.isAxiosError
vi.mock('axios', () => ({
    default: {
        isAxiosError: vi.fn((error) => error?.response !== undefined),
    },
}))

describe('createChatService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should fetch conversations successfully', async () => {
        const mockResponse = {
            data: {
                data: {
                    data: [
                        {
                            id: 'chat-1',
                            participant: {
                                id: 'user-2',
                                username: 'john',
                                name: 'John Doe',
                                avatar_url: null,
                            },
                            last_message: 'Hello',
                            unread_count: 0,
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z',
                        },
                    ],
                    pagination: {
                        next_cursor: null,
                        has_more: false,
                    },
                },
            },
        }

        mockAxiosGet.mockResolvedValue(mockResponse)

        const chatService = createChatService()
        const result = await chatService.getConversations(null, 20)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.data[0].id).toBe('chat-1')
        expect(result.data[0].participant.username).toBe('john')
        expect(result.hasMore).toBe(false)
        expect(result.nextCursor).toBeNull()
    })

    it('should throw error when response data is missing', async () => {
        mockAxiosGet.mockResolvedValue({
            data: null,
        })

        const chatService = createChatService()

        await expect(chatService.getConversations(null, 20)).rejects.toThrow()
    })

    it('should throw error on API failure', async () => {
        mockAxiosGet.mockRejectedValue(new Error('Network error'))

        const chatService = createChatService()

        await expect(chatService.getConversations(null, 20)).rejects.toThrow()
    })

    it('should create conversation successfully', async () => {
        const mockResponse = {
            data: {
                data: {
                    id: 'chat-2',
                    participant: {
                        id: 'user-3',
                        username: 'jane_doe',
                        name: 'Jane Doe',
                        avatar_url: null,
                    },
                    last_message: null,
                    unread_count: 0,
                    created_at: '2024-01-03T00:00:00Z',
                    updated_at: '2024-01-03T00:00:00Z',
                },
            },
        }

        mockAxiosPost.mockResolvedValue(mockResponse)

        const chatService = createChatService()
        const result = await chatService.createConversation('user-3')

        expect(result).toBeDefined()
        expect(result.id).toBe('chat-2')
        expect(result.participant.username).toBe('jane_doe')
        expect(mockAxiosPost).toHaveBeenCalledWith('/chat', {
            recipient_id: 'user-3',
        })
    })

    it('should mark conversation as read', async () => {
        mockAxiosPost.mockResolvedValue({ data: {} })

        const chatService = createChatService()
        await chatService.markAsRead('chat-1', 'msg-123')

        expect(mockAxiosPost).toHaveBeenCalledWith('/chat/chats/chat-1/read', {
            last_read_message_id: 'msg-123',
        })
    })
})
