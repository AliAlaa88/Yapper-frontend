import type { User, Tweet } from '../types'

export const getProfileUrl = (user: { username: string | null; link: string | null }): string => {
    return user.link || (user.username ? `/${user.username}` : '#')
}

export const getTweetUrl = (
    tweet: Tweet | { user: { username: string | null }; tweet_id: string | null },
): string => {
    return tweet.user.username && tweet.tweet_id
        ? `/${tweet.user.username}/status/${tweet.tweet_id}`
        : '#'
}

export const getTweetUrlFromParts = (username: string, tweetId: string): string => {
    return `/${username}/status/${tweetId}`
}
