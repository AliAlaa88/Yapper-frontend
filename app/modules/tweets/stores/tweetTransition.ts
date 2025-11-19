import { defineStore } from 'pinia'
import type { Tweet } from '../types/tweet'

export const useTweetTransitionStore = defineStore('tweetTransition', {
    state: () => ({
        transitionTweet: null as Tweet | null,
    }),
    actions: {
        setTransitionTweet(tweet: Tweet) {
            this.transitionTweet = tweet
        },
        clearTransitionTweet() {
            this.transitionTweet = null
        },
    },
})
