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

    describe('getConversationById', () => {
        it('should fetch conversation by id successfully', async () => {
            const mockResponse = {
                data: {
                    data: {
                        id: 'chat-1',
                        participant: {
                            id: 'user-2',
                            username: 'john',
                            name: 'John Doe',
                            avatar_url: null,
                        },
                        last_message: 'Hello',
                        unread_count: 0,
                    },
                },
            }

            mockAxiosGet.mockResolvedValue(mockResponse)

            const chatService = createChatService()
            const result = await chatService.getConversationById('chat-1')

            expect(result).toBeDefined()
            expect(result.id).toBe('chat-1')
            expect(mockAxiosGet).toHaveBeenCalledWith('/chat/chat-1')
        })

        it('should throw error on getConversationById failure', async () => {
            mockAxiosGet.mockRejectedValue(new Error('Not found'))

            const chatService = createChatService()

            await expect(chatService.getConversationById('invalid-id')).rejects.toThrow()
        })
    })

    describe('getMessages', () => {
        it('should fetch messages successfully', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: {
                            chat_id: 'chat-1',
                            messages: [
                                {
                                    id: 'msg-1',
                                    content: 'Hello',
                                    sender_id: 'user-1',
                                    created_at: '2024-01-01T00:00:00Z',
                                },
                                {
                                    id: 'msg-2',
                                    content: 'Hi',
                                    sender_id: 'user-2',
                                    created_at: '2024-01-01T00:05:00Z',
                                },
                            ],
                        },
                        pagination: {
                            next_cursor: 'cursor-xyz',
                            has_more: true,
                        },
                    },
                },
            }

            mockAxiosGet.mockResolvedValue(mockResponse)

            const chatService = createChatService()
            const result = await chatService.getMessages('chat-1', { limit: 50, cursor: null })

            expect(result).toBeDefined()
            expect(result.chatId).toBe('chat-1')
            expect(result.messages).toHaveLength(2)
            expect(result.hasMore).toBe(true)
            expect(result.nextCursor).toBe('cursor-xyz')
        })

        it('should use default limit for getMessages', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: {
                            chat_id: 'chat-1',
                            messages: [],
                        },
                        pagination: {
                            next_cursor: null,
                            has_more: false,
                        },
                    },
                },
            }

            mockAxiosGet.mockResolvedValue(mockResponse)

            const chatService = createChatService()
            await chatService.getMessages('chat-1')

            expect(mockAxiosGet).toHaveBeenCalledWith('/messages/chats/chat-1/messages', {
                params: {
                    limit: 50,
                    cursor: undefined,
                },
            })
        })

        it('should throw error on 401 status for getMessages', async () => {
            mockAxiosGet.mockRejectedValue({
                response: {
                    status: 401,
                },
            })

            const chatService = createChatService()

            await expect(chatService.getMessages('chat-1')).rejects.toThrow('Invalid or expired token')
        })

        it('should throw error on 403 status for getMessages', async () => {
            mockAxiosGet.mockRejectedValue({
                response: {
                    status: 403,
                },
            })

            const chatService = createChatService()

            await expect(chatService.getMessages('chat-1')).rejects.toThrow('Unauthorized access to chat')
        })

        it('should throw error on 404 status for getMessages', async () => {
            mockAxiosGet.mockRejectedValue({
                response: {
                    status: 404,
                },
            })

            const chatService = createChatService()

            await expect(chatService.getMessages('chat-1')).rejects.toThrow('Chat not found')
        })

        it('should throw error when messages data is missing', async () => {
            mockAxiosGet.mockResolvedValue({
                data: null,
            })

            const chatService = createChatService()

            await expect(chatService.getMessages('chat-1')).rejects.toThrow()
        })
    })

    describe('error handling', () => {
        it('should handle 401 error on getConversations', async () => {
            mockAxiosGet.mockRejectedValue({
                response: {
                    status: 401,
                },
            })

            const chatService = createChatService()

            await expect(chatService.getConversations()).rejects.toThrow('Invalid or expired token')
        })

        it('should handle 401 error on createConversation', async () => {
            mockAxiosPost.mockRejectedValue({
                response: {
                    status: 401,
                },
            })

            const chatService = createChatService()

            await expect(chatService.createConversation('user-1')).rejects.toThrow('Invalid or expired token')
        })

        it('should handle 401 error on markAsRead', async () => {
            mockAxiosPost.mockRejectedValue({
                response: {
                    status: 401,
                },
            })

            const chatService = createChatService()

            await expect(chatService.markAsRead('chat-1', 'msg-1')).rejects.toThrow('Invalid or expired token')
        })
    })
})
