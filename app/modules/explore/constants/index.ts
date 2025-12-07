export interface Tab {
    value: 'for_you' | 'trending' | 'news' | 'sports' | 'entertainment'
    label: string
}

export const tabs: Tab[] = [
    { value: 'for_you', label: 'For you' },
    { value: 'trending', label: 'Trending' },
    { value: 'news', label: 'News' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
]