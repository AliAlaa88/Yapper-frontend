import type { Tweet } from './tweet'

interface Content {
    text: string
    images?: string[]
    videos?: string[]
    parentTweet?: Tweet | null
    quotedTweet?: Tweet | null
    mentions?: string[]
}

export type { Content }
