import type {
    QuoteTweet,
    BaseTweet,
    User,
} from '../types/notificationsSocketEvents'

import type {
    ApiNotification,
    ReplyNotification,
    QuoteNotification,
    MentionNotification,
} from '../types/notifications'

import type { Tweet } from '~/modules/tweets/types'
import { useUserStore } from '~/modules/auth/stores/userStore'

export const mapNotificationUserToTweetUser = (u: User): Tweet['user'] => ({
    id: u.id,
    name: u.name,
    username: u.username,
    avatar_url: u.avatar_url ?? '',
    verified: u.verified ?? false,
    bio: u.bio ?? '',
    followers: u.followers ?? 0,
    following: u.following ?? 0,
    is_following: u.is_following ?? null,
    link: null,
    cover_url: u.cover_url ?? null,
    country: null,
    created_at: '',
    birth_date: null,
    language: null,
    email: '',
})

export const mapReplyNotificationToTweet = (n: ReplyNotification): Tweet => {
    const userStore = useUserStore()

    const reply = mapBaseTweetToTweet(
        n.reply_tweet,
        mapNotificationUserToTweetUser(n.replier),
    )

    if (n.original_tweet && userStore.user) {
        reply.parent_tweet = mapBaseTweetToTweet(
            n.original_tweet,
            userStore.user,
        )
    }

    return reply
}

export const mapBaseTweetToTweet = (base: BaseTweet, user: Tweet['user']): Tweet => ({
    tweet_id: base.tweet_id,
    type: base.type,
    content: base.content,
    images: base.images ?? [],
    videos: base.videos ?? [],
    gifs: [],
    likes_count: base.likes_count ?? 0,
    reposts_count: base.reposts_count ?? 0,
    views_count: base.views_count ?? 0,
    quotes_count: base.quotes_count ?? 0,
    replies_count: base.replies_count ?? 0,
    is_liked: base.is_liked ?? false,
    is_reposted: base.is_reposted ?? false,
    is_bookmarked: base.is_bookmarked ?? false,
    created_at: base.created_at,
    updated_at: base.updated_at,
    user,
    parent_tweet: null,
    conversation_tweet: null,
})

export const mapQuoteNotificationToTweet = (n: QuoteNotification): Tweet => {
    const userStore = useUserStore()

    const quote = mapBaseTweetToTweet(
        n.quote_tweet,
        mapNotificationUserToTweetUser(n.quoter),
    )

    if (n.quote_tweet.parent_tweet && userStore.user) {
        quote.parent_tweet = mapBaseTweetToTweet(
            n.quote_tweet.parent_tweet,
            userStore.user,
        )
    }

    return quote
}

export const mapMentionNotificationToTweet = (n: MentionNotification): Tweet => {
    const userStore = useUserStore()

    const tweet = mapBaseTweetToTweet(
        n.tweet,
        mapNotificationUserToTweetUser(n.mentioner),
    )

    if (n.tweet.type === 'quote' && 'parent_tweet' in n.tweet && userStore.user) {
        const qt = n.tweet as QuoteTweet
        if (qt.parent_tweet) {
            tweet.parent_tweet = mapBaseTweetToTweet(
                qt.parent_tweet,
                userStore.user,
            )
        }
    }

    return tweet
}

export const mapNotificationToTweet = (n: ApiNotification): Tweet | null => {
    switch (n.type) {
        case 'reply':
            return mapReplyNotificationToTweet(n)
        case 'quote':
            return mapQuoteNotificationToTweet(n)
        case 'mention':
            return mapMentionNotificationToTweet(n)
        default:
            return null
    }
}

export const shouldUseTweetComponent = (n: ApiNotification) =>
    ['reply', 'quote', 'mention'].includes(n.type)

export const shouldUseCardComponent = (n: ApiNotification) =>
    ['follow', 'like', 'repost', 'message'].includes(n.type)
