declare module 'twitter-text' {
    export function extractHashtags(text: string): string[]
    export function extractMentions(text: string): string[]
    export function extractUrls(text: string): string[]
    export function autoLink(text: string, options?: any): string
    export function htmlEscape(text: string): string
}
