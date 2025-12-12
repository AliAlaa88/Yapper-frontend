import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function escapeHtml(str = ''): string {
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function parseLinks(text = '', isMessage: boolean = false): string {
    if (!text) return ''
    const escaped = escapeHtml(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withUrls = escaped.replace(urlRegex, (url: string) => {
        const safeUrl = escapeHtml(url)
        return `<a href="${safeUrl}" class="${isMessage ? '' : 'text-accent'} hover:underline" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    })

    // Mentions: @username -> /username
    const mentionRegex = /@([\p{L}0-9_]+)/gu
    const withMentions = withUrls.replace(mentionRegex, (_match: string, user: string) => {
        const display = `@${escapeHtml(user)}`
        const href = `/${encodeURIComponent(user)}`
        return `<a href="${href}" data-mention="${escapeHtml(user)}" class="text-accent hover:underline">${display}</a>`
    })

    const hashtagRegex = /#([\p{L}0-9_-]+)/gu
    const withHashtags = withMentions.replace(hashtagRegex, (_match: string, tag: string) => {
        const display = `#${escapeHtml(tag)}`
        const href = `/search?q=${encodeURIComponent('#' + tag)}`
        return `<a href="${href}" data-hashtag="${escapeHtml(tag)}" class="text-accent hover:underline">${display}</a>`
    })

    return withHashtags
}
