import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function escapeHtml(str = ''): string {
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function parseLinks(text = ''): string {
    if (!text) return ''
    const escaped = escapeHtml(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withUrls = escaped.replace(urlRegex, (url: string) => {
        const safeUrl = escapeHtml(url)
        return `<a href="${safeUrl}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    })

    const hashtagRegex = /#([\p{L}0-9_-]+)/gu
    const withHashtags = withUrls.replace(hashtagRegex, (_match: string, tag: string) => {
        const display = `#${escapeHtml(tag)}`
        const href = `/search?q=${encodeURIComponent('#' + tag)}`
        return `<a href="${href}" data-hashtag="${escapeHtml(tag)}" class="text-blue-500 underline">${display}</a>`
    })

    return withHashtags
}
