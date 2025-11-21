import type { OtherUser } from '~/modules/profile/types/user'

export interface Lists {
    data: OtherUser[]
    count: number
    message: string
}
