import { ref, computed } from 'vue'
import type { QueryClient } from '@tanstack/vue-query'
import type { createSocketService } from '~/modules/Common/services/socketServices'
import {
    SOCKET_EVENTS,
    type JoinChatPayload,
    type LeaveChatPayload,
    type SendMessagePayload,
    type UpdateMessagePayload,
    type DeleteMessagePayload,
    type TypingPayload,
    type UnreadChatsSummary,
    type JoinedChatResponse,
    type LeftChatResponse,
    type MessageSentResponse,
    type NewMessageEvent,
    type MessageUpdatedEvent,
    type MessageDeletedEvent,
    type UserTypingEvent,
    type UnreadChatSummaryItem,
} from '../types/socketEvents'
import type { Message, Conversation, MessageSender } from '../types'

type SocketService = ReturnType<typeof createSocketService>

interface MessagesQueryData {
    pages: Array<{
        messages: Message[]
        sender: MessageSender
        nextCursor?: string
    }>
    pageParams: (string | undefined)[]
}

interface ChatSocketServiceDependencies {
    socketService: SocketService
    queryClient: QueryClient
}

export const createChatSocketService = (deps: ChatSocketServiceDependencies) => {
    const { socketService, queryClient } = deps

    const currentChatId = ref<string | null>(null)
    const isJoiningChat = ref(false)
    const isLeavingChat = ref(false)
    const isSendingMessage = ref(false)
    const isMeTyping = ref(false)

    const unreadChats = ref<Map<string, UnreadChatSummaryItem>>(new Map())
    const typingUsers = ref<Map<string, Set<string>>>(new Map())

    let typingTimeout: ReturnType<typeof setTimeout> | null = null
    const TYPING_TIMEOUT = 3000

    let listenersInitialized = false

    const totalUnreadCount = computed(() => {
        let total = 0
        unreadChats.value.forEach((chat) => {
            total += chat.unread_count
        })
        return total
    })

    const initializeListeners = () => {
        if (listenersInitialized) return

        socketService.on(SOCKET_EVENTS.UNREAD_CHATS_SUMMARY, handleUnreadSummary)
        socketService.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
        socketService.on(SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated)
        socketService.on(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted)
        socketService.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping)
        socketService.on(SOCKET_EVENTS.USER_STOPPED_TYPING, handleUserStoppedTyping)

        listenersInitialized = true
        console.log('[ChatSocket] Listeners initialized')
    }

    const removeListeners = () => {
        if (!listenersInitialized) return

        socketService.off(SOCKET_EVENTS.UNREAD_CHATS_SUMMARY)
        socketService.off(SOCKET_EVENTS.NEW_MESSAGE)
        socketService.off(SOCKET_EVENTS.MESSAGE_UPDATED)
        socketService.off(SOCKET_EVENTS.MESSAGE_DELETED)
        socketService.off(SOCKET_EVENTS.USER_TYPING)
        socketService.off(SOCKET_EVENTS.USER_STOPPED_TYPING)

        listenersInitialized = false
        console.log('[ChatSocket] Listeners removed')
    }

    // ============ Chat Room Methods ============
    const joinChat = (chatId: string): Promise<JoinedChatResponse> => {
        return new Promise((resolve, reject) => {
            if (!socketService.isConnected()) {
                reject(new Error('Socket not connected'))
                return
            }

            isJoiningChat.value = true
            console.log('[ChatSocket] Joining chat:', chatId)
            const payload: JoinChatPayload = { chat_id: chatId }

            const timeout = setTimeout(() => {
                isJoiningChat.value = false
                reject(new Error('Join chat timeout'))
            }, 10000)

            socketService.once(SOCKET_EVENTS.JOINED_CHAT, (data: JoinedChatResponse) => {
                clearTimeout(timeout)
                console.log('[ChatSocket] Joined chat:', data)
                currentChatId.value = chatId
                clearUnreadCount(chatId)
                isJoiningChat.value = false
                resolve(data)
            })

            socketService.once(SOCKET_EVENTS.ERROR, (error: { message: string }) => {
                clearTimeout(timeout)
                isJoiningChat.value = false
                reject(new Error(error.message))
            })

            socketService.emit(SOCKET_EVENTS.JOIN_CHAT, payload)
        })
    }

    const leaveChat = (chatId?: string): Promise<LeftChatResponse> => {
        return new Promise((resolve, reject) => {
            const targetChatId = chatId || currentChatId.value

            if (!socketService.isConnected()) {
                reject(new Error('Socket not connected'))
                return
            }

            if (!targetChatId) {
                reject(new Error('No chat to leave'))
                return
            }

            if (isMeTyping.value) {
                stopTyping(targetChatId)
            }

            isLeavingChat.value = true
            const payload: LeaveChatPayload = { chat_id: targetChatId }

            const timeout = setTimeout(() => {
                isLeavingChat.value = false
                reject(new Error('Leave chat timeout'))
            }, 10000)

            socketService.once(SOCKET_EVENTS.LEFT_CHAT, (data: LeftChatResponse) => {
                clearTimeout(timeout)
                console.log('[ChatSocket] Left chat:', data)
                if (targetChatId === currentChatId.value) {
                    currentChatId.value = null
                }
                clearTypingUsers(targetChatId)
                isLeavingChat.value = false
                resolve(data)
            })

            socketService.once(SOCKET_EVENTS.ERROR, (error: { message: string }) => {
                clearTimeout(timeout)
                isLeavingChat.value = false
                reject(new Error(error.message))
            })

            socketService.emit(SOCKET_EVENTS.LEAVE_CHAT, payload)
        })
    }

    const enterChat = async (chatId: string) => {
        if (currentChatId.value && currentChatId.value !== chatId) {
            try {
                await leaveChat()
            } catch (error) {
                console.error('[ChatSocket] Failed to leave previous chat:', error)
            }
        }
        return joinChat(chatId)
    }

    // ============ Message Methods ============
    const sendMessage = (
        chatId: string,
        options: {
            content?: string
            mediaUrl?: string
            messageType: 'text' | 'image' | 'video'
        },
    ) => {
        if (!socketService.isConnected()) {
            console.warn('[ChatSocket] Cannot send message - socket not connected')
            return
        }

        isSendingMessage.value = true

        if (isMeTyping.value && currentChatId.value) {
            stopTyping(currentChatId.value)
        }

        const payload: SendMessagePayload = {
            chat_id: chatId,
            message: {
                content: options.content,
                media_url: options.mediaUrl,
                message_type: options.messageType,
            },
        }

        const timeout = setTimeout(() => {
            isSendingMessage.value = false
            console.error('[ChatSocket] Send message timeout')
        }, 30000)

        socketService.once(SOCKET_EVENTS.MESSAGE_SENT, (data: MessageSentResponse) => {
            clearTimeout(timeout)
            console.log('[ChatSocket] Message sent:', data)
            isSendingMessage.value = false

            const newMessage: Message = {
                id: data.id,
                content: data.content,
                sender_id: data.sender_id,
                created_at: data.created_at,
                updated_at: data.created_at,
                is_read: data.is_read,
                message_type: options.messageType,
                reply_to: null,
            }

            addMessageToCache(chatId, newMessage)
            updateConversationLastMessage(chatId, newMessage)
        })

        socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, payload)
    }

    const updateMessage = (chatId: string, messageId: string, content: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!socketService.isConnected()) {
                reject(new Error('Socket not connected'))
                return
            }

            const payload: UpdateMessagePayload = {
                chat_id: chatId,
                message_id: messageId,
                update: { content },
            }

            const timeout = setTimeout(() => {
                reject(new Error('Update message timeout'))
            }, 10000)

            socketService.once(SOCKET_EVENTS.MESSAGE_UPDATED, () => {
                clearTimeout(timeout)
                updateMessageInCache(chatId, messageId, { content })
                resolve()
            })

            socketService.once(SOCKET_EVENTS.ERROR, (error: { message: string }) => {
                clearTimeout(timeout)
                reject(new Error(error.message))
            })

            socketService.emit(SOCKET_EVENTS.UPDATE_MESSAGE, payload)
        })
    }

    const deleteMessage = (chatId: string, messageId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!socketService.isConnected()) {
                reject(new Error('Socket not connected'))
                return
            }

            const payload: DeleteMessagePayload = {
                chat_id: chatId,
                message_id: messageId,
            }

            const timeout = setTimeout(() => {
                reject(new Error('Delete message timeout'))
            }, 10000)

            socketService.once(SOCKET_EVENTS.MESSAGE_DELETED, () => {
                clearTimeout(timeout)
                removeMessageFromCache(chatId, messageId)
                resolve()
            })

            socketService.once(SOCKET_EVENTS.ERROR, (error: { message: string }) => {
                clearTimeout(timeout)
                reject(new Error(error.message))
            })

            socketService.emit(SOCKET_EVENTS.DELETE_MESSAGE, payload)
        })
    }

    // ============ Typing Methods ============
    const startTyping = (chatId: string) => {
        if (!socketService.isConnected()) return

        if (!isMeTyping.value) {
            isMeTyping.value = true
            const payload: TypingPayload = { chat_id: chatId }
            socketService.emit(SOCKET_EVENTS.TYPING_START, payload)
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        typingTimeout = setTimeout(() => {
            stopTyping(chatId)
        }, TYPING_TIMEOUT)
    }

    const stopTyping = (chatId: string) => {
        if (!socketService.isConnected()) return

        if (isMeTyping.value) {
            isMeTyping.value = false
            const payload: TypingPayload = { chat_id: chatId }
            socketService.emit(SOCKET_EVENTS.TYPING_STOP, payload)
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout)
            typingTimeout = null
        }
    }

    const handleTyping = () => {
        if (currentChatId.value) {
            startTyping(currentChatId.value)
        }
    }

    // ============ Event Callbacks ============
    const handleUnreadSummary = (data: UnreadChatsSummary) => {
        console.log('[ChatSocket] Unread summary:', data)
        unreadChats.value.clear()
        data.chats.forEach((chat) => {
            unreadChats.value.set(chat.chat_id, chat)
        })
    }

    const handleNewMessage = (data: NewMessageEvent) => {
        console.log('[ChatSocket] New message:', data)

        const newMessage: Message = {
            id: data.message.id,
            content: data.message.content,
            sender_id: data.message.sender_id,
            created_at: data.message.created_at,
            updated_at: data.message.created_at,
            is_read: data.message.is_read,
            message_type: 'text',
            reply_to: null,
        }

        addMessageToCache(data.chat_id, newMessage)
        updateConversationOnNewMessage(data.chat_id, newMessage)
        removeTypingUser(data.chat_id, data.message.sender_id)
    }

    const handleMessageUpdated = (data: MessageUpdatedEvent) => {
        console.log('[ChatSocket] Message updated:', data)
        updateMessageInCache(data.chat_id, data.message_id, {
            content: data.message.content,
        })
    }

    const handleMessageDeleted = (data: MessageDeletedEvent) => {
        console.log('[ChatSocket] Message deleted:', data)
        removeMessageFromCache(data.chat_id, data.message_id)
    }

    const handleUserTyping = (data: UserTypingEvent) => {
        console.log('[ChatSocket] User typing:', data)
        addTypingUser(data.chat_id, data.user_id)

        setTimeout(() => {
            removeTypingUser(data.chat_id, data.user_id)
        }, 5000)
    }

    const handleUserStoppedTyping = (data: UserTypingEvent) => {
        console.log('[ChatSocket] User stopped typing:', data)
        removeTypingUser(data.chat_id, data.user_id)
    }

    // ============ Cache Helpers ============
    const addMessageToCache = (chatId: string, message: Message) => {
        try {
            queryClient.setQueryData<MessagesQueryData>(['messages', chatId], (oldData) => {
                if (!oldData || !oldData.pages.length) {
                    return oldData
                }

                const messageExists = oldData.pages.some((page) =>
                    page.messages.some((msg) => msg.id === message.id),
                )
                if (messageExists) return oldData

                const newPages = [...oldData.pages]
                const lastPageIndex = newPages.length - 1
                const lastPage = newPages[lastPageIndex]

                if (lastPage) {
                    newPages[lastPageIndex] = {
                        ...lastPage,
                        messages: [...lastPage.messages, message],
                    }
                }

                return { ...oldData, pages: newPages }
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not update messages cache:', error)
        }
    }

    const updateMessageInCache = (chatId: string, messageId: string, updates: Partial<Message>) => {
        try {
            queryClient.setQueryData<MessagesQueryData>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        messages: page.messages.map((msg) =>
                            msg.id === messageId ? { ...msg, ...updates } : msg,
                        ),
                    })),
                }
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not update message in cache:', error)
        }
    }

    const removeMessageFromCache = (chatId: string, messageId: string) => {
        try {
            queryClient.setQueryData<MessagesQueryData>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        messages: page.messages.filter((msg) => msg.id !== messageId),
                    })),
                }
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not remove message from cache:', error)
        }
    }

    const updateConversationLastMessage = (chatId: string, message: Message) => {
        try {
            queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
                if (!oldData) return oldData

                return oldData.map((conv) => {
                    if (conv.id === chatId) {
                        return {
                            ...conv,
                            last_message: message,
                            updated_at: new Date().toISOString(),
                        }
                    }
                    return conv
                })
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not update conversation:', error)
        }
    }

    const updateConversationOnNewMessage = (chatId: string, message: Message) => {
        const isInChat = currentChatId.value === chatId

        try {
            queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
                if (!oldData) return oldData

                return oldData.map((conv) => {
                    if (conv.id === chatId) {
                        return {
                            ...conv,
                            last_message: message,
                            updated_at: new Date().toISOString(),
                            unread_count: isInChat ? conv.unread_count : conv.unread_count + 1,
                        }
                    }
                    return conv
                })
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not update conversation on new message:', error)
        }

        if (!isInChat) {
            incrementUnreadCount(chatId)
        }
    }

    // ============ Unread Helpers ============
    const getUnreadCount = (chatId: string): number => {
        return unreadChats.value.get(chatId)?.unread_count || 0
    }

    const clearUnreadCount = (chatId: string) => {
        const chat = unreadChats.value.get(chatId)
        if (chat) {
            unreadChats.value.set(chatId, { ...chat, unread_count: 0 })
        }

        try {
            queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
                if (!oldData) return oldData

                return oldData.map((conv) => {
                    if (conv.id === chatId) {
                        return { ...conv, unread_count: 0 }
                    }
                    return conv
                })
            })
        } catch (error) {
            console.warn('[ChatSocket] Could not clear unread count in cache:', error)
        }
    }

    const incrementUnreadCount = (chatId: string) => {
        const chat = unreadChats.value.get(chatId)
        if (chat) {
            unreadChats.value.set(chatId, {
                ...chat,
                unread_count: chat.unread_count + 1,
            })
        } else {
            unreadChats.value.set(chatId, {
                chat_id: chatId,
                unread_count: 1,
                last_message: { id: '', content: '', created_at: new Date().toISOString() },
            })
        }
    }

    // ============ Typing Helpers ============
    const addTypingUser = (chatId: string, userId: string) => {
        const users = typingUsers.value.get(chatId) || new Set()
        users.add(userId)
        typingUsers.value.set(chatId, new Set(users))
    }

    const removeTypingUser = (chatId: string, userId: string) => {
        const users = typingUsers.value.get(chatId)
        if (users) {
            users.delete(userId)
            if (users.size === 0) {
                typingUsers.value.delete(chatId)
            } else {
                typingUsers.value.set(chatId, new Set(users))
            }
        }
    }

    const clearTypingUsers = (chatId: string) => {
        typingUsers.value.delete(chatId)
    }

    const isUserTypingInChat = (chatId: string): boolean => {
        const users = typingUsers.value.get(chatId)
        return users ? users.size > 0 : false
    }

    const getTypingUsersInChat = (chatId: string): string[] => {
        const users = typingUsers.value.get(chatId)
        return users ? Array.from(users) : []
    }

    // ============ Reset ============
    const reset = () => {
        currentChatId.value = null
        isJoiningChat.value = false
        isLeavingChat.value = false
        isSendingMessage.value = false
        isMeTyping.value = false
        unreadChats.value.clear()
        typingUsers.value.clear()

        if (typingTimeout) {
            clearTimeout(typingTimeout)
            typingTimeout = null
        }
    }

    return {
        // State
        currentChatId: computed(() => currentChatId.value),
        isJoiningChat: computed(() => isJoiningChat.value),
        isLeavingChat: computed(() => isLeavingChat.value),
        isSendingMessage,
        isMeTyping: computed(() => isMeTyping.value),
        totalUnreadCount,
        typingUsers: computed(() => typingUsers.value),

        // Lifecycle
        initializeListeners,
        removeListeners,
        reset,

        // Chat rooms
        joinChat,
        leaveChat,
        enterChat,

        // Messages
        sendMessage,
        updateMessage,
        deleteMessage,

        // Typing
        startTyping,
        stopTyping,
        handleTyping,

        // Unread
        getUnreadCount,
        clearUnreadCount,

        // Typing status
        isUserTypingInChat,
        getTypingUsersInChat,
    }
}

export type ChatSocketService = ReturnType<typeof createChatSocketService>
