import type { Tweet, TweetDetails } from '../types'
import { useNuxtApp } from '#app'

// Map JSON server tweet structure to our Tweet type
const mapTweetFromServer = (serverTweet: any): Tweet => {
    return {
        id: serverTweet.post_id,
        content: {
            text: serverTweet.content,
            images: serverTweet.images_url || [],
            videos: serverTweet.videos_url || [],
        },
        user: serverTweet.user,
        stats: {
            likes: serverTweet.likes_count,
            replies: serverTweet.replies_count,
            retweets: serverTweet.reposts_count,
            views: serverTweet.views,
        },
        type: serverTweet.type === 'reply' ? 'reply' : 'tweet',
        createdAt: new Date(serverTweet.date).toISOString(),
    }
}

// Helper function to enhance tweets with user data
const enhanceWithUserData = async (tweets: any[]): Promise<any[]> => {
    const { $axios } = useNuxtApp()

    return Promise.all(
        tweets.map(async (serverTweet: any) => {
            try {
                const userResponse = await $axios.get(`/api/users?user_id=${serverTweet.user_id}`)
                if (userResponse.data.length > 0) {
                    const userData = userResponse.data[0]
                    const tweetUser = {
                        ...serverTweet,
                        user: {
                            id: userData.user_id,
                            name: userData.name,
                            username: userData.username,
                            avatar: userData.avatar_url,
                            link: userData.link || '',
                            bio: userData.bio || '',
                            followers_count: userData.followers_count || 0,
                            following_count: userData.following_count || 0,
                        },
                    }
                    return tweetUser
                }
            } catch (error) {
                console.warn('Failed to fetch user data for tweet:', serverTweet.post_id)
            }

            return serverTweet
        }),
    )
}

export const tweetServiceMock = {
    async fetchTweets(path: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(path)

        // Client-side filtering for media tweets (json-server limitation)
        const tweets = response.data
        const tweetsWithUserData = await enhanceWithUserData(tweets)
        return tweetsWithUserData.map(mapTweetFromServer)
    },

    async fetchTweetDetails(tweetId: string): Promise<TweetDetails | null> {
        const { $axios } = useNuxtApp()

        // Fetch the main tweet using the configured route
        const tweetResponse = await $axios.get(`/api/tweets/${tweetId}`)
        if (!tweetResponse.data || tweetResponse.data.length === 0) {
            return null
        }

        const tweetData = Array.isArray(tweetResponse.data)
            ? tweetResponse.data[0]
            : tweetResponse.data
        const [enhancedTweet] = await enhanceWithUserData([tweetData])
        const tweet = mapTweetFromServer(enhancedTweet)

        // Fetch replies for this tweet
        const replies: Tweet[] = await this.fetchRepliesForTweet(tweetId)
        return {
            tweet,
            replies,
        }
    },

    async fetchRepliesForTweet(tweetId: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()

        // Fetch replies for the specific tweet
        const response = await $axios.get(`/api/tweets/${tweetId}/replies`)

        const replies = response.data
        const repliesWithUserData = await enhanceWithUserData(replies)
        return repliesWithUserData.map(mapTweetFromServer)
    },

    async fetchUserById(userId: string) {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(`/api/users?user_id=${userId}`)
        return response.data.length > 0 ? response.data[0] : null
    },
}
