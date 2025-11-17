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

export const formatDate = (date: string) => {
    const now = new Date()
    const tweetDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - tweetDate.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`

    return tweetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
