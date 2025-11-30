import type { OtherUser } from '~/modules/profile/types/user'

export interface MutedAndBlockedListsApiResponse {
    data: {
        data: OtherUser[]
        pagination: {
            next_cursor: string
            has_more: boolean
        }
    }
    count: number
    message: string
}

export interface ChangePasswordRequest {
    old_password: string
    new_password: string
}

export interface ChangePasswordResponse {
    data: Record<string, never>
    count: number
    message: string
}

export interface ConfirmPasswordRequest {
    password: string
}

export interface ConfirmPasswordResponse {
    data: {
        valid: boolean
    }
    count: number
    message: string
}

export interface DeleteAccountResponse {
    data: Record<string, never>
    count: number
    message: string
}

