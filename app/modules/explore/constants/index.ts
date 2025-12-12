export interface Tab {
    value: 'for_you' | 'trending' | 'news' | 'sports' | 'entertainment'
    label: string
    translationKey: string
    test_id: string
}

export const tabs: Tab[] = [
    { value: 'for_you', label: 'For you', translationKey: 'explore.tabs.forYou' , test_id: 'tab-for-you' },
    { value: 'trending', label: 'Trending', translationKey: 'explore.tabs.trending', test_id: 'tab-trending' },
    { value: 'news', label: 'News', translationKey: 'explore.tabs.news', test_id: 'tab-news' },
    { value: 'sports', label: 'Sports', translationKey: 'explore.tabs.sports', test_id: 'tab-sports' },
    { value: 'entertainment', label: 'Entertainment', translationKey: 'explore.tabs.entertainment', test_id: 'tab-entertainment' },
]