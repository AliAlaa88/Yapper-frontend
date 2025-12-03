// ============ client  server Events ============

export interface JoinChatPayload {
    chat_id: string
}

export interface LeaveChatPayload {
    chat_id: string
}

export interface SendMessagePayload {
    chat_id: string
    message: {
        content?: string
        media_url?: string
        message_type: 'text' | 'image' | 'video'
    }
}

export interface UpdateMessagePayload {
    chat_id: string
    message_id: string
    update: {
        content: string
    }
}

export interface DeleteMessagePayload {
    chat_id: string
    message_id: string
}

export interface TypingPayload {
    chat_id: string
}

// ============ server → client Events ============

export interface UnreadChatSummaryItem {
    chat_id: string
    unread_count: number
    last_message: {
        id: string
        content: string
        created_at: string
    }
}

export interface UnreadChatsSummary {
    chats: UnreadChatSummaryItem[]
    message: string
}

export interface JoinedChatResponse {
    chat_id: string
    message: string
}

export interface LeftChatResponse {
    chat_id: string
    message: string
}

export interface MessageSentResponse {
    id: string
    content: string
    sender_id: string
    is_read: boolean
    created_at: string
}

export interface NewMessageEvent {
    chat_id: string
    message: {
        id: string
        content: string
        sender_id: string
        is_read: boolean
        created_at: string
    }
}

export interface MessageUpdatedEvent {
    chat_id: string
    message_id: string
    message: {
        id: string
        content: string
        updated_at: string
    }
}

export interface MessageDeletedEvent {
    chat_id: string
    message_id: string
}

export interface UserTypingEvent {
    chat_id: string
    user_id: string
}

export interface SocketErrorEvent {
    event: 'error'
    data: {
        message: string
    }
}

// ============ event names ============

export const SOCKET_EVENTS = {
    // client → server
    JOIN_CHAT: 'join_chat',
    LEAVE_CHAT: 'leave_chat',
    SEND_MESSAGE: 'send_message',
    UPDATE_MESSAGE: 'update_message',
    DELETE_MESSAGE: 'delete_message',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',

    // server → client
    UNREAD_CHATS_SUMMARY: 'unread_chats_summary',
    JOINED_CHAT: 'joined_chat',
    LEFT_CHAT: 'left_chat',
    MESSAGE_SENT: 'message_sent',
    NEW_MESSAGE: 'new_message',
    MESSAGE_UPDATED: 'message_updated',
    MESSAGE_DELETED: 'message_deleted',
    USER_TYPING: 'user_typing',
    USER_STOPPED_TYPING: 'user_stopped_typing',
    ERROR: 'error',
} as const

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]
