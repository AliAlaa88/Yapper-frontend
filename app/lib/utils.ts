import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import twitterText from 'twitter-text'
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function escapeHtml(str = ''): string {
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function parseLinks(
    text = '',
    isMessage: boolean = false,
    isPostTweet: boolean = false,
    mentions?: string[],
): string {
    if (!text) return ''
    const escaped = escapeHtml(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withUrls = escaped.replace(urlRegex, (url: string) => {
        const safeUrl = escapeHtml(url)
        return `<a href="${safeUrl}" class="${isMessage ? '' : 'text-accent'} hover:underline" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    })

    if (isMessage) {
        return withUrls
    }

    // Mentions: @username -> /username
    let withMentions = withUrls
    if (isPostTweet) {
        const mentionRegex = /@([\p{L}0-9_]+)/gu
        withMentions = withUrls.replace(mentionRegex, (_match: string, user: string) => {
            const display = `@${escapeHtml(user)}`
            const href = `/${encodeURIComponent(user)}`
            return `<NuxtLink href="${href}" data-mention="${escapeHtml(user)}" class="text-accent hover:underline">${display}</NuxtLink>`
        })
    } else {
        const mentionRegex = /\$\((\d+)\)/gu
        withMentions = withUrls.replace(mentionRegex, (_match: string, index: string) => {
            const user = mentions ? mentions[Number(index)] : null
            if (!user) return _match

            const display = `@${escapeHtml(user)}`
            const href = `/${encodeURIComponent(user)}`

            return `<NuxtLink href="${href}" data-mention="${escapeHtml(user)}" class="text-accent hover:underline">${display}</NuxtLink>`
        })
    }

    const extractedHashtags = twitterText.extractHashtags(text)

    let withHashtags = withMentions
    extractedHashtags.forEach((tag: string) => {
        const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const hashtagRegex = new RegExp(`#${escapedTag}(?![^<]*>)(?![^<]*</)`, 'gi')
        withHashtags = withHashtags.replace(hashtagRegex, () => {
            const display = `#${escapeHtml(tag)}`
            const href = `/search?q=${encodeURIComponent('#' + tag)}`
            return `<NuxtLink href="${href}" data-hashtag="${escapeHtml(tag)}" class="text-accent hover:underline">${display}</NuxtLink>`
        })
    })

    return withHashtags
}
