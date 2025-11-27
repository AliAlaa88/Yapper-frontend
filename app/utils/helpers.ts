import type { User } from '~/modules/auth/types/user'
import Cookie from 'js-cookie'
export function isLoggedIn(): boolean {
    const user = localStorage.getItem('user')
    const token = Cookie.get('access_token')
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

/**
 * Converts text with hashtags (#) and mentions (@) into styled HTML for Vue
 * @param {string} text - The input text containing hashtags and mentions
 * @returns {string} HTML string with styled tags using Tailwind classes
 */
export function parseTextWithTags(text: string): string {
    if (!text) return ''

    // 1. Escape HTML to prevent XSS attacks (important before injecting HTML)
    const escapeHtml = (str: string): string => {
        const htmlEscapes: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        }
        return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
    }

    let result = escapeHtml(text)

    // 2. Define styling for the tags (Twitter Blue)
    const tagClasses = 'text-[#1d9bf0] font-normal'

    // 3. Regex replacements
    // Replace hashtags (#word)
    // We look for # followed by alphanumeric characters
    result = result.replace(/(^|\s)(#[\w]+)/g, (match, space, tag) => {
        return `${space}<span class="${tagClasses}">${tag}</span>`
    })

    // Replace mentions (@username)
    result = result.replace(/(^|\s)(@[\w]+)/g, (match, space, tag) => {
        return `${space}<span class="${tagClasses}">${tag}</span>`
    })

    // 4. Handle line breaks for display
    // Note: We don't replace \n with <br> here because the CSS white-space: pre-wrap
    // handles that better for synchronization with textareas

    return result
}
export const handleImageError = (userName: string, event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = `https://ui-avatars.com/api/?name=${userName}`
}
