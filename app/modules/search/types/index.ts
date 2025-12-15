export interface SearchQuery {
    query: string
    is_trending?: boolean
}

export interface UserSuggestion {
    user_id: string
    name: string
    username: string
    avatar_url: string
    is_following: boolean
    is_follower: boolean
}

export interface SearchSuggestion {
    suggested_queries: SearchQuery[]
    suggested_users: UserSuggestion[]
}
