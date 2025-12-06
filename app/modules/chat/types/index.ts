export interface participant {
    id: string
    name: string
    username: string
    avatar_url: string | null
}

export interface MessageSender {
    id: string
    username: string
    name: string
    avatar_url: string | null
}

export interface Message {
    id: string
    content: string
    message_type: 'text' | 'image' | 'video' | 'reply'
    sender: MessageSender
    reply_to: string | null
    is_read: boolean
    is_edited: boolean
    created_at: string
    updated_at: string
}

export interface MessagesApiResponse {
    data: {
        data: {
            chat_id: string
            sender: MessageSender
            messages: Message[]
        }
        pagination: {
            next_cursor: string | null
            has_more: boolean
        }
    }
    count: number
    message: string
}

export interface MessagesPage {
    chatId: string
    messages: Message[]
    nextCursor: string | null
    hasMore: boolean
}

export interface Conversation {
    id: string
    participant: participant
    last_message?: Message
    unread_count: number
    created_at: string
    updated_at: string
}

export interface ConversationApiResponse {
    data: {
        data: Conversation[]
        pagination: {
            next_cursor: string | null
            has_more: boolean
        }
    }
    count: number
    message: string
}
