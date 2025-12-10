
<template>
    <div :class="['notification-item', { 'is-new': isNew }]">
        <Tweet
            v-if="notification && shouldUseTweet && tweetData"
            :tweet="tweetData"
        />
        <NotificationCard
            v-else-if="notification && shouldUseCard"
            :icon="notificationIcon"
            :icon-color="notificationIconColor"
            :fill-color="notificationFillColor"
            :message="notificationMessage"
            :created-at="formatDateWithMonth(notification.created_at)"
            :link="notificationLink"
            :users="notificationUsers"
            :post-text="notificationPostText"
        />
    </div>
</template>


<script setup lang="ts">
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue'
import NotificationCard from './NotificationCard.vue'
import type { ApiNotification } from '../../types/notifications'
import { Repeat2, Heart, UserRound, MessageCircle } from 'lucide-vue-next'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { mapNotificationToTweet, shouldUseCardComponent, shouldUseTweetComponent } from '../../utils/notificationMapper'
const props = defineProps<{
    notification: ApiNotification
}>()
const isNew = ref(false)
const route = useRoute()
const shouldUseTweet = computed(() => shouldUseTweetComponent(props.notification))
const shouldUseCard = computed(() => shouldUseCardComponent(props.notification))


const tweetData = computed(() => {
    const mapping =  mapNotificationToTweet(props.notification)
    console.log('mapppping', mapping)
    return mapping
})

const notificationUsers = computed(() => {
    const notif = props.notification

    switch (notif.type) {
        case 'follow':
            return notif.followers
        case 'like':
            return notif.likers
        case 'repost':
            return notif.reposters
        case 'message':
            return [notif.sender]
        default:
            return []
    }
})

const notificationPostText = computed(() => {
    const notif = props.notification
    if (notif.type === 'like' && notif.tweets.length > 1) {
        return notif.tweets[notif.tweets.length - 1]?.content || ''
    }

    if (notif.type === 'repost' && notif.tweets.length > 1) {
        return notif.tweets[notif.tweets.length - 1]?.content || ''
    }

    if (notif.type === 'like' && notif.tweets.length > 0) {
        return notif.tweets[0]?.content || ''
    }

    if (notif.type === 'repost' && notif.tweets.length > 0) {
        return notif.tweets[0]?.content || ''
    }

    return ''
})

const notificationIcon = computed(() => {
    switch (props.notification.type) {
        case 'follow':
            return UserRound
        case 'like':
            return Heart
        case 'repost':
            return Repeat2
        case 'message':
            return MessageCircle
        default:
            return null
    }
})

const notificationIconColor = computed(() => {
    switch (props.notification.type) {
        case 'follow':
            return '#1d9bf0'
        case 'like':
            return '#f91880'
        case 'repost':
            return '#00ba7c'
        case 'message' :
            return '#7856ff'
        default:
            return ''
    }
})

const notificationFillColor = computed(() => {
    switch (props.notification.type) {
        case 'like':
            return '#f91880'
        case 'follow':
            return '#1d9bf0'
        default:
            return ''
    }
})

const { t } = useI18n()

const notificationMessage = computed(() => {
    const notif = props.notification

    switch (notif.type) {
        case 'follow':
            return t('notifications.followedYou')

        case 'like':
            if (notif.tweets.length > 1) {
                return t('notifications.likedMany', {
                    count: notif.tweets.length,
                })
            }

            if (notif.tweets.length === 1 && notif.tweets[0]?.type === 'reply') {
                return t('notifications.likedYourReply')
            }

            return t('notifications.likedYourPost')

        case 'repost':
            if (notif.tweets.length > 1) {
                return t('notifications.repostedMany', {
                    count: notif.tweets.length,
                })
            }

            return t('notifications.repostedYourPost')

        case 'message':
            return t('notifications.sentYouAMessage')

        default:
            return ''
    }
})


const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationLink = computed(() => {
    const notif = props.notification

    if (notif.type === 'follow' && notif.followers.length === 1) {
        return `/${notif.followers[0]?.username || ''}`
    }

    if (notif.type === 'like' && notif.tweets.length > 0) {
        const tweet = notif.tweets[0]
        if (tweet?.tweet_id) {
            return `/${notif.likers[0]?.username || ''}/status/${tweet.tweet_id}`
        }
    }

    if (notif.type === 'repost' && notif.tweets.length > 0) {
        const tweet = notif.tweets[0]
        if (tweet?.tweet_id) {
            return `/${notif.reposters[0]?.username || ''}/status/${tweet.tweet_id}`
        }
    }

    if (notif.type === 'follow' && notif.followers.length > 1) {
        return `/${user.value?.username}/followers`
    }

    if (notif.type === 'message') {
        return `/messages/${notif.chat_id}`
    }

    return '#'
})

onMounted(() => {
    const now = Date.now()
    const createdAt = new Date(props.notification.created_at).getTime()

    if (now - createdAt < 60000 && route.path === '/notifications') {
        isNew.value = true

        setTimeout(() => {
            isNew.value = false
        }, 10000)
    }
})

watch(() => props.notification.created_at, () => {
    const now = Date.now()
    const createdAt = new Date(props.notification.created_at).getTime()
    if (now - createdAt < 60000 && route.path === '/notifications') {
        isNew.value = true
        setTimeout(() => {
            isNew.value = false
        }, 10000)
    }
})
</script>

<style scoped>
.notification-item {
    transition: all 0.4s ease;
}

.notification-item.is-new {
    background:rgba(0, 209, 178, 0.08);
}

</style>
