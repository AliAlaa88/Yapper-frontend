import type { Tweet, TweetDetails, User } from '../types'
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
        user: {
            id: serverTweet.user_id,
            name: serverTweet.name || serverTweet.username, // Use name if available, fallback to username
            username: serverTweet.username,
            avatar: serverTweet.avatar_url,
            link: '', // Not provided in server structure
        },
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

export const tweetServiceMock = {
    async fetchTweets(): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get('/tweets')
        
        // Enhance tweets with user information from users table
        const tweetsWithUserData = await Promise.all(
            response.data.map(async (serverTweet: any) => {
                try {
                    // Fetch user details from users table using json-server query syntax
                    const userResponse = await $axios.get(`/users?user_id=${serverTweet.user_id}`)
                    
                    if (userResponse.data.length > 0) {
                        const userData = userResponse.data[0]
                        // Merge server tweet with user data
                        return {
                            ...serverTweet,
                            name: userData.name, // Get the actual name from users table
                        }
                    }
                } catch (error) {
                    console.warn('Failed to fetch user data for tweet:', serverTweet.post_id)
                }
                
                // Return original tweet if user fetch fails
                return serverTweet
            })
        )
        
        return tweetsWithUserData.map(mapTweetFromServer)
    },

    async fetchTweetById(tweetId: string): Promise<Tweet | null> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(`/tweets?post_id=${tweetId}`)
        
        if (response.data.length === 0) {
            return null
        }
        
        const serverTweet = response.data[0]
        
        // Enhance with user information
        try {
            const userResponse = await $axios.get(`/users?user_id=${serverTweet.user_id}`)
            
            if (userResponse.data.length > 0) {
                const userData = userResponse.data[0]
                serverTweet.name = userData.name
            }
        } catch (error) {
            console.warn('Failed to fetch user data for tweet:', tweetId)
        }
        
        return mapTweetFromServer(serverTweet)
    },

    async fetchTweetDetails(tweetId: string): Promise<TweetDetails | null> {
        // Fetch the main tweet
        const tweet = await this.fetchTweetById(tweetId)
        if (!tweet) {
            return null
        }

        // Fetch replies
        const { $axios } = useNuxtApp()
        const repliesResponse = await $axios.get('/tweets?type=reply')
        
        const replies = repliesResponse.data
            .filter((reply: any) => reply.type === 'reply')
            .map(mapTweetFromServer)

        return {
            tweet,
            replies,
        }
    },

    async fetchUserTweets(username: string): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(`/tweets?username=${username}`)
        return response.data.map(mapTweetFromServer)
    },

    async fetchUserById(userId: string) {
        const { $axios } = useNuxtApp()
        const response = await $axios.get(`/users?user_id=${userId}`)
        return response.data.length > 0 ? response.data[0] : null
    },

    async fetchLikedTweets(): Promise<Tweet[]> {
        // TODO: Implement when likes data is available in db.json
        // For now, return empty array or mock data
        return []
    },

    async fetchMediaTweets(): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        // json-server doesn't support complex queries, so we fetch all and filter client-side
        const response = await $axios.get('/tweets')
        
        // Filter tweets that have images or videos
        const mediaTweets = response.data.filter((tweet: any) => 
            (tweet.images_url && tweet.images_url.length > 0) || 
            (tweet.videos_url && tweet.videos_url.length > 0)
        )
        
        // Enhance with user data
        const tweetsWithUserData = await Promise.all(
            mediaTweets.map(async (serverTweet: any) => {
                try {
                    const userResponse = await $axios.get(`/users?user_id=${serverTweet.user_id}`)
                    
                    if (userResponse.data.length > 0) {
                        const userData = userResponse.data[0]
                        return {
                            ...serverTweet,
                            name: userData.name,
                        }
                    }
                } catch (error) {
                    console.warn('Failed to fetch user data for tweet:', serverTweet.post_id)
                }
                
                return serverTweet
            })
        )
        
        return tweetsWithUserData.map(mapTweetFromServer)
    },

    async fetchReplies(): Promise<Tweet[]> {
        const { $axios } = useNuxtApp()
        // json-server query parameter syntax
        const response = await $axios.get('/tweets?type=reply')
        
        // Enhance with user data
        const repliesWithUserData = await Promise.all(
            response.data.map(async (serverTweet: any) => {
                try {
                    const userResponse = await $axios.get(`/users?user_id=${serverTweet.user_id}`)
                    
                    if (userResponse.data.length > 0) {
                        const userData = userResponse.data[0]
                        return {
                            ...serverTweet,
                            name: userData.name,
                        }
                    }
                } catch (error) {
                    console.warn('Failed to fetch user data for tweet:', serverTweet.post_id)
                }
                
                return serverTweet
            })
        )
        
        return repliesWithUserData.map(mapTweetFromServer)
    }
}