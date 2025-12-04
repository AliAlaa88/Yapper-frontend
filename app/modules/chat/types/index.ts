export interface participant {
    id: string
    name: string
    username: string
    avatar: string
}

export interface MessageSender {
    id: string
    username: string
    name: string
    avatar_url: string
}

export interface Message {
    id: string
    content: string
    message_type: 'text' | 'image' | 'video' | 'reply'
    sender_id: string
    reply_to: string | null
    is_read: boolean
    created_at: string
    updated_at: string
}

export interface MessagesResponse {
    data: {
        sender: MessageSender
        messages: Message[]
    }
    count: number
    message: string
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
