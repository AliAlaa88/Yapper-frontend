import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'

dayjs.extend(isToday)

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

export const formatMessageDate = (date: string) => {
    const messageDate = dayjs(date)
    const now = dayjs()

    if (messageDate.isToday()) {
        return messageDate.format('h:mm A')
    }

    const daysDiff = now.diff(messageDate, 'day')
    if (daysDiff < 7) {
        return messageDate.format('dddd h:mm A')
    }

    return messageDate.format('MMM D, YYYY h:mm A')
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

export function shorterName(name: string, maxLength: number = 15): string {
    if (name.length > maxLength) {
        return name.slice(0, maxLength) + '...'
    }
    return name
}
