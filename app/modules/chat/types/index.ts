export interface participant {
    id: string
    name: string
    username: string
    avatar: string
}


export interface Message {
    id: string
    content: string
    message_type: string,
    sender_id: string,
    created_at: string,
    is_read: boolean
}

export interface Conversation {
    id: string
    participant: participant,
    last_message?: Message
    unread_count: number
    created_at: string
    updated_at: string
}

export interface ConversationApiResponse {
    data: Conversation[]
}


