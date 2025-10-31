import type { User } from '~/modules/auth/types/user'

export function isLoggedIn(): boolean {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    if (user && token) {
        return true
    }
    return false
}

export function getUser(): User {
    const user = localStorage.getItem('user')
    return JSON.parse(user as string) as User
}
