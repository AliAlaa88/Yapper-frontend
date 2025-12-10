import type {
    TweetComponent,
    QuoteTweet,
    CountTweet,
    User,
} from '../types/notificationsSocketEvents'

import type {
    ApiNotification,
    ReplyNotification,
    QuoteNotification,
    MentionNotification,
} from '../types/notifications'

import type { Tweet } from '~/modules/tweets/types'

export const mapNotificationUser = (user: User | undefined): Tweet['user'] => {
    if (!user) {
        return {
            id: '',
            name: '',
            username: '',
            avatar_url: '',
            verified: false,
            bio: '',
            followers_count: 0,
            following_count: 0,
            is_following: null,
            link: null,
            cover_url: null,
            country: null,
            created_at: '',
            birth_date: null,
            language: null,
            email: '',
        }
    }

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url ?? '',
        verified: user.verified ?? false,
        bio: user.bio ?? '',
        followers_count: user.followers ?? 0,
        following_count: user.following ?? 0,
        is_following: null,
        link: null,
        cover_url: null,
        country: null,
        created_at: '',
        birth_date: null,
        language: null,
        email: '',
    }
}

export const mapAnyBaseTweetToTweet = (
    base: TweetComponent | CountTweet | QuoteTweet,
    user?: User,
): Tweet => {
    return {
        tweet_id: base.tweet_id,
        type: base.type as 'tweet' | 'reply' | 'quote',
        content: base.content,
        images: base.images ?? [],
        videos: base.videos ?? [],
        gifs: [],

        // num_* or *_count (WS / REST compatibility)
        likes_count: (base as any).num_likes ?? (base as any).likes_count ?? 0,
        reposts_count: (base as any).num_reposts ?? (base as any).reposts_count ?? 0,
        views_count: (base as any).num_views ?? (base as any).views_count ?? 0,
        quotes_count: (base as any).num_quotes ?? (base as any).quotes_count ?? 0,
        replies_count: (base as any).num_replies ?? (base as any).replies_count ?? 0,
        is_bookmarked: (base as any).is_bookmarked ?? false,

        is_liked: false,
        is_reposted: false,

        created_at: base.created_at,
        updated_at: base.updated_at,

        user: user
            ? mapNotificationUser(user)
            : {
                id: base.user_id ?? '',
                name: '',
                username: '',
                avatar_url: '',
                verified: false,
                bio: '',
                followers_count: 0,
                following_count: 0,
                is_following: null,
                link: null,
                cover_url: null,
                country: null,
                created_at: '',
                birth_date: null,
                language: null,
                email: '',
            },

        parent_tweet: null,
        conversation_tweet: null,
    }
}

export const mapParentTweet = (parent: QuoteTweet['parent_tweet']): Tweet | null => {
    if (!parent) return null

    return {
        tweet_id: parent.tweet_id,
        type: parent.type as 'tweet' | 'reply' | 'quote',
        content: parent.content,
        images: parent.images ?? [],
        videos: parent.videos ?? [],
        gifs: [],
        likes_count: 0,
        reposts_count: 0,
        views_count: 0,
        quotes_count: 0,
        replies_count: 0,
        is_liked: false,
        is_reposted: false,
        is_bookmarked: parent.is_bookmarked ?? false,
        created_at: parent.created_at,
        updated_at: parent.updated_at,
        user: mapNotificationUser(parent.user),
        parent_tweet: null,
        conversation_tweet: null,
    }
}

export const mapReplyNotificationToTweet = (n: ReplyNotification): Tweet => {
    const reply = mapAnyBaseTweetToTweet(n.reply_tweet as TweetComponent, n.replier)

    if (n.original_tweet) {
        reply.parent_tweet = mapAnyBaseTweetToTweet(n.original_tweet as TweetComponent)
    }

    return reply
}

export const mapQuoteNotificationToTweet = (n: QuoteNotification): Tweet => {
    const quoteTweet = mapAnyBaseTweetToTweet(n.quote_tweet, n.quoter)

    // Fix: parent_tweet exists inside quote_tweet
    if (n.quote_tweet.parent_tweet) {
        quoteTweet.parent_tweet = mapParentTweet(n.quote_tweet.parent_tweet)
    }

    return quoteTweet
}

export const mapMentionNotificationToTweet = (n: MentionNotification): Tweet => {
    const tweet = mapAnyBaseTweetToTweet(n.tweet as TweetComponent, n.mentioner)

    if (n.tweet_type === 'quote' && 'parent_tweet' in n.tweet) {
        const qt = n.tweet as QuoteTweet
        if (qt.parent_tweet) {
            const parent = mapParentTweet(qt.parent_tweet)
            tweet.parent_tweet = parent
            ;(tweet as any).quoted_tweet = parent
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
