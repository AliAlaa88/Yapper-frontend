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
                user_id: '0c059899-f706-4c8f-97d7-ba2e9fc22d6d',
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
}
