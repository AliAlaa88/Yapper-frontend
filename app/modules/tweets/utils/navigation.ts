import type { User, Tweet } from '../types'

export const getProfileUrl = (user: User): string => {
  return user.link || (user.username ? `/profile/${user.username}` : '#')
}

export const getTweetUrl = (tweet: Tweet): string => {
  return tweet.user.username && tweet.id ? `/${tweet.user.username}/status/${tweet.id}` : '#'
}

export const getTweetUrlFromParts = (username: string, tweetId: string): string => {
  return `/${username}/status/${tweetId}`
}