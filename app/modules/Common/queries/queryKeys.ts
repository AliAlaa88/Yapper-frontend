import { Bookmark } from "lucide-vue-next";

/**
 * Centralized query keys factory for type-safe cache management.
 * Use these keys consistently across all queries and mutations.
 */
export const queryKeys = {
    // Tweet related keys
    tweets: {
        all: ['tweets'],
        list: (path: string) => ['tweets', path],
        details: (tweetId: string) => ['tweetDetails', tweetId],
    },

    // User related keys
    users: {
        all: ['user'] as const,
        profile: (username: string) => ['user', username] as const,
        byId: (userId: string) => ['user', userId] as const,
        me: () => ['me'] as const,
        followers: (userId: string) => ['followers', userId] as const,
        following: (userId: string) => ['following', userId] as const,
    },

    // Settings related keys
    settings: {
        mutedUsers: () => ['muted-users'] as const,
        blockedUsers: () => ['blocked-users'] as const,
        usernameRecommendation: () => ['username-recommendation'] as const,
    },

    // Auth related keys
    auth: {
        user: () => ['getUser'] as const,
    },

    // Chat/Conversation related keys
    conversations: {
        all: ['conversations'] as const,
    },
    search: {
        all: ['tweets', '/search'] as const,
    },
    bookmarks: {
        all: ['tweets', 'tweets/bookmarks'] as const,
    }


} as const
