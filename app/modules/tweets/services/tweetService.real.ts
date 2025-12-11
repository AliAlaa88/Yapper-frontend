import type { Tweet, TweetDetails, TweetsPage, TweetSummary } from '../types'

export const tweetServiceReal = {
    async fetchTweets(path: string, nextCursor: string): Promise<TweetsPage> {
        const { $axios } = useNuxtApp()

        const separator = path.includes('?') ? '&' : '?'
        const response = await $axios.get(
            `${path}` + (nextCursor ? `${separator}cursor=${nextCursor}` : ''),
        )
        const page = response.data.data

        return {
            data: page.data.filter((t: any) => t.tweet_id),
            nextCursor: page.pagination?.next_cursor ?? page.next_cursor,
            hasMore: page.pagination?.has_more ?? page.has_more,
            parent: page.pagination?.parent ?? page.parent,
        }
    },

    async fetchTweetById(tweetId: string): Promise<Tweet | null> {
        throw new Error(`tweetServiceReal.fetchTweetById not implemented yet: ${tweetId}`)
    },

    async fetchTweetDetails(tweetId: string): Promise<Tweet | null> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}`)

            if (response.data && response.data.data) {
                return response.data.data
            }

            return null
        } catch (error: any) {
            return null
        }
    },
    async fetchTweetSummary(tweetId: string): Promise<TweetSummary | null> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(`/tweets/${tweetId}/summary`)
        if (response.data && response.data.data) {
            return response.data.data
        }
        return null
    },
    async fetchtweetreplies(tweetId: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}/replies`)
            if (response.data && response.data.data) {
                return response.data.data
            }
            return []
        } catch (error: any) {
            return []
        }
    },
    async fetchtweetquotes(tweetId: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}/quotes`)
            // API shape: { data: { data: [...], count, parent, next_cursor, has_more }, ... }
            const payload = response.data?.data
            if (payload?.data) return payload.data
            return []
        } catch (error: any) {
            return []
        }
    },
    async fetchTweetReposts(tweetId: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}/reposts`)
            const payload = response.data?.data
            console.log('Reposts payload:', payload.data)
            if (payload?.data) return payload.data
            return []
        } catch (error: any) {
            return []
        }
    },
    async fetchUserTweets(userId: string): Promise<Tweet[]> {
        throw new Error(`tweetServiceReal.fetchUserTweets not implemented yet: ${userId}`)
    },

    async fetchUserById(userId: string) {
        throw new Error(`tweetServiceReal.fetchUserById not implemented yet: ${userId}`)
    },
    async likeTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.post(`/tweets/${tweetId}/like`)
    },
    async unlikeTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}/like`)
    },
    async repostTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.post(`/tweets/${tweetId}/repost`)
    },
    async unrepostTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}/repost`)
    },
    async bookmarkTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.post(`/tweets/${tweetId}/bookmark`)
    },
    async unbookmarkTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}/bookmark`)
    },
    async deleteTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}`)
    },
    async updateTweet(tweetId: string, content: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.patch(`/tweets/${tweetId}`, { content })
    },
}
