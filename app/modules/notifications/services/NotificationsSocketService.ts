import {
    SOCKET_EVENTS,
    type NotificationEvent,
} from '../types/notificationsSocketEvents'
import type { createSocketService } from '~/modules/Common/services/socketServices'
import {
    isFollowEvent,
    isLikeEvent,
    isReplyEvent,
    isRepostEvent,
    isQuoteEvent,
    isMentionEvent,
    isAddAction,
    isRemoveAction,
    isAggregateAction,
} from '../types/notificationsSocketEvents'
import type { ApiNotification } from '../types/notifications'
import type { QueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'

type SocketService = ReturnType<typeof createSocketService>

interface NotificationSocketServiceDependencies {
    socketService: SocketService
    queryClient: QueryClient
}

export const createNotificationsSocketService = (deps: NotificationSocketServiceDependencies) => {
    const { socketService, queryClient } = deps
    let listenersInitialized = false
    const unreadCount = ref<number>(0)
    const route = useRoute()

    const initializeListeners = () => {
        if (listenersInitialized) {
            return
        }

        socketService.on(SOCKET_EVENTS.NEWEST_COUNT, (data: { newest_count: number }) => {
            console.log('NEWEST_COUNT event received:', data)
            handleNewestCount(data.newest_count)
        })
        socketService.on(SOCKET_EVENTS.FOLLOW, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.LIKE, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.QUOTE, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.REPLY, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.REPOST, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.MENTION, handleWebSocketEvent)
        socketService.on(SOCKET_EVENTS.MESSAGE, handleWebSocketEvent)
        listenersInitialized = true
    }

    const removeListeners = (): void => {
        socketService.off(SOCKET_EVENTS.FOLLOW)
        socketService.off(SOCKET_EVENTS.LIKE)
        socketService.off(SOCKET_EVENTS.REPLY)
        socketService.off(SOCKET_EVENTS.REPOST)
        socketService.off(SOCKET_EVENTS.QUOTE)
        socketService.off(SOCKET_EVENTS.MENTION)
        socketService.off(SOCKET_EVENTS.NEWEST_COUNT)

        listenersInitialized = false
    }

    const handleNewestCount = (count: number) => {
        console.log(`Unread count updated: ${count}`)
        unreadCount.value = count
    }

    const isOnNotificationsPage = computed(() => {
        return route.path === '/notifications'
    })

    const incrementUnreadCount = () => {
        if (!isOnNotificationsPage.value) {
            unreadCount.value += 1
            console.log('Unread count incremented', unreadCount.value)
        } else markNotificationsAsSeen()
    }

    const markNotificationsAsSeen = () => {
        if (!socketService.isConnected()) return

        console.log('sending mark_seen event to server')
        socketService.emit(SOCKET_EVENTS.MARK_SEEN, {})
        unreadCount.value = 0
    }

    const handleWebSocketEvent = (event: NotificationEvent) => {
        if (isAddAction(event)) {
            const apiNotification = convertWebSocketToApi(event)
            if (apiNotification) {
                addNotificationToCache(['notifications'], apiNotification)
                if (apiNotification.type === 'reply' || apiNotification.type === 'mention') {
                    addNotificationToCache(['mentions'], apiNotification)
                }
                incrementUnreadCount()
            }
        } else if (isRemoveAction(event)) {
            handleRemoveNotification(event)
        } else if (isAggregateAction(event)) {
            const apiNotification = convertWebSocketToApi(event)
            if (apiNotification) {
                replaceNotificationInCache(['notifications'], apiNotification)
                incrementUnreadCount()
            }
        }
    }

    const handleRemoveNotification = (event: NotificationEvent) => {
        cacheInvalidation.onRemoveNotification(queryClient)
        if (event.type === 'reply' || event.type === 'mention') {
            cacheInvalidation.onRemoveMention(queryClient)
        }
    }

    const addNotificationToCache = (queryKey: string[], notification: ApiNotification | null) => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData?.pages || !notification) {
                return oldData
            }

            const firstPage = oldData.pages[0]
            return {
                ...oldData,
                pages: [
                    {
                        ...firstPage,
                        notifications: [notification, ...firstPage.notifications],
                        total: firstPage.total + 1,
                    },
                    ...oldData.pages.slice(1),
                ],
            }
        })
    }

    const getNotificationId = (notification: ApiNotification): string => {
        switch (notification.type) {
            case 'follow':
                return `follow_${notification.followers[0]?.id}`
            case 'like':
                return `like_${notification.tweets[0]?.tweet_id}_${notification.likers[0]?.id}`
            case 'reply':
                return `reply_${notification.reply_tweet.tweet_id}`
            case 'repost':
                return `repost_${notification.tweets[0]?.tweet_id}_${notification.reposters[0]?.id}`
            case 'quote':
                return `quote_${notification.quote_tweet.tweet_id}`
            case 'mention':
                return `mention_${notification.tweet.tweet_id}`
            case 'message' :
                return `message_${notification.message_id}`
            default:
                return `notification_${(notification as { created_at?: string }).created_at ?? ''}`
        }
    }

    const replaceNotificationInCache = (
        queryKey: string[],
        notification: ApiNotification,
    ): void => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData?.pages) return oldData
            let found = false
            const newPages = oldData.pages.map((page: any) => {
                const notifications = page.notifications.map((n: ApiNotification) => {
                    if (notification.type === 'follow' && n.type === 'follow') {
                        const match = n.followers[0]?.id === notification.followers[0]?.id
                        if (match) {
                            found = true
                            return notification
                        }
                    }

                    if (notification.type === 'like' && n.type === 'like') {
                        const isAggregatedByPerson =
                            notification.likers.length === 1 && notification.tweets.length > 1
                        const isAggregatedByTweet =
                            notification.likers.length > 1 && notification.tweets.length === 1
                        const match = isAggregatedByTweet
                            ? n.tweets[0]?.tweet_id === notification.tweets[0]?.tweet_id
                            : isAggregatedByPerson
                                ? n.likers[0]?.id === notification.likers[0]?.id
                                : false

                        if (match) {
                            found = true
                            return notification
                        }
                    }

                    if (notification.type === 'repost' && n.type === 'repost') {
                        const isAggregatedByPerson =
                            notification.reposters.length === 1 && notification.tweets.length > 1
                        const isAggregatedByTweet =
                            notification.reposters.length > 1 && notification.tweets.length === 1
                        const match = isAggregatedByTweet
                            ? n.tweets[0]?.tweet_id === notification.tweets[0]?.tweet_id
                            : isAggregatedByPerson
                                ? n.reposters[0]?.id === notification.reposters[0]?.id
                                : false
                        if (match) {
                            found = true
                            return notification
                        }
                    }
                    return n
                })
                return { ...page, notifications }
            })
            if (!found) {
                newPages[0].notifications.unshift(notification)
                newPages[0].total += 1
            }

            return { ...oldData, pages: newPages }
        })
    }

    const convertWebSocketToApi = (event: NotificationEvent): ApiNotification | null => {
        if (event.type === 'message' && event.action === 'add') {
            return {
                type: 'message' as const,
                created_at: event.created_at || new Date().toISOString(),
                sender: event.sender,
                message_id: event.message_id,
                chat_id: event.chat_id,
            }
        }

        if (isFollowEvent(event) && event.action === 'add') {
            return {
                type: 'follow',
                created_at: event.created_at || new Date().toISOString(),
                followers: [
                    {
                        id: event.follower_id,
                        name: '',
                        username: event.follower_name,
                        email: '',
                        avatar_url: event.follower_avatar_url,
                    },
                ],
            }
        }

        if (isFollowEvent(event) && event.action === 'aggregate') {
            return {
                type: 'follow',
                created_at: event.created_at || new Date().toISOString(),
                followers: event.followers,
            }
        }

        if (isLikeEvent(event) && event.action === 'add') {
            return {
                type: 'like',
                created_at: event.created_at || new Date().toISOString(),
                likers: [event.liker],
                tweets: [event.tweet],
            }
        }

        if (isLikeEvent(event) && event.action === 'aggregate') {
            return {
                type: 'like',
                created_at: event.created_at || new Date().toISOString(),
                likers: event.likers,
                tweets: event.tweets,
            }
        }

        if (isReplyEvent(event) && event.action === 'add') {
            return {
                type: 'reply',
                created_at: event.created_at || new Date().toISOString(),
                replier: event.replier,
                reply_tweet: event.reply_tweet,
                original_tweet: event.original_tweet,
                conversation_id: event.conversation_id,
            }
        }

        if (isRepostEvent(event) && event.action === 'add') {
            return {
                type: 'repost',
                created_at: event.created_at || new Date().toISOString(),
                reposters: [event.reposter],
                tweets: [event.tweet],
            }
        }

        if (isRepostEvent(event) && event.action === 'aggregate') {
            return {
                type: 'repost',
                created_at: event.created_at || new Date().toISOString(),
                reposters: event.reposters,
                tweets: event.tweets,
            }
        }

        if (isQuoteEvent(event) && event.action === 'add') {
            return {
                type: 'quote',
                created_at: event.created_at || new Date().toISOString(),
                quoter: event.quoted_by,
                quote_tweet: event.quote,
            }
        }

        if (isMentionEvent(event) && event.action === 'add') {
            return {
                type: 'mention',
                created_at: event.created_at || new Date().toISOString(),
                mentioner: event.mentioned_by,
                tweet: event.tweet as any, // CountTweet | QuoteTweet → BaseTweet
                tweet_type: event.tweet_type,
            }
        }

        return null
    }

    return {
        initializeListeners,
        removeListeners,
        getNotificationId,
        markNotificationsAsSeen,
        unreadCount,
    }
}

export type NotificationsSocketService = ReturnType<typeof createNotificationsSocketService>
