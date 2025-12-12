import type { SearchSuggestion } from '../types'
const response = {
    data: {
        suggested_queries: [
            {
                query: 'alyaa',
                is_trending: true,
            },
            {
                query: 'alia',
                is_trending: false,
            },
            {
                query: 'ali',
                is_trending: true,
            },
        ],
        suggested_users: [
            {
                user_id: '0c059899-f706-4c8f-97d7-ba2e9fc22d6d',
                name: 'Alyaa Ali',
                username: 'Alyaali242',
                avatar_url: 'https://cdn.app.com/profiles/u877.jpg',
                is_following: true,
                is_follower: false,
            },
            {
                user_id: '0c059899-f706-4c8f-97d7-ba2e9fc2',
                name: 'Alia Mohamed',
                username: 'alyaa#222',
                avatar_url: 'https://cdn.app.com/profiles/u877.jpg',
                is_following: true,
                is_follower: true,
            },
        ],
    },
    count: 2,
    message: 'Search suggestions retrieved successfully',
}

export const searchServiceMock = {
    async getSearchSuggestions(query: string): Promise<SearchSuggestion> {
        return response.data
    },

    async getUsers(query: string) {
        console.log('[searchService mock] mention suggestions request', { query })
        if (!query) return []
        const lowered = query.toLowerCase()
        const users = response.data.suggested_users || []
        if (!Array.isArray(users)) return []
        const filtered = users.filter(
            (user) =>
                user.username.toLowerCase().includes(lowered) ||
                (user.name || '').toLowerCase().includes(lowered),
        )
        const limited = filtered.slice(0, 5)
        console.log('[searchService mock] mention suggestions response', { count: limited.length })
        return limited
    },
}
