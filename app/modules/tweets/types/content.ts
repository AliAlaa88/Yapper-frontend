import type { Tweet } from './tweet'

interface Content {
    text: string
    images?: string[]
    videos?: string[]
    parentTweet?: Tweet | null
}

export type { Content }