export interface Tab {
    value: 'for_you' | 'trending' | 'news' | 'sports' | 'entertainment'
    label: string
    translationKey: string
}

export const tabs: Tab[] = [
    { value: 'for_you', label: 'For you', translationKey: 'explore.tabs.forYou' },
    { value: 'trending', label: 'Trending', translationKey: 'explore.tabs.trending' },
    { value: 'news', label: 'News', translationKey: 'explore.tabs.news' },
    { value: 'sports', label: 'Sports', translationKey: 'explore.tabs.sports' },
    {
        value: 'entertainment',
        label: 'Entertainment',
        translationKey: 'explore.tabs.entertainment',
    },
]
