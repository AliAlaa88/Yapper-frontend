<template>
    <article
        :id="`tweet-${id}`"
        class="border-b border-primary px-4 py-3 hover:bg-hover bg-primary transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div v-if="tweet.type === 'repost'" class="flex items-center gap-2 mb-2 text-secondary">
            <Repeat2 :size="16" />
            <span class="text-sm">
                {{ repostedUsername }}
                {{ $t('tweets.reposted') }}
            </span>
        </div>

        <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="shrink-0">
                <NuxtLink :id="`tweet-avatar-link-${id}`" :to="profileUrl" @click.stop>
                    <CustomToolTip
                        :delay-duration="300"
                        content-class="rounded-2xl shadow-xl border border-primary"
                    >
                        <template #trigger>
                            <img
                                :id="`tweet-avatar-${id}`"
                                :src="user.avatar"
                                :alt="user.name"
                                class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
                                @error="(event) => handleImageError(user.name, event)"
                            />
                        </template>
                        <template #content>
                            <UserCard
                                :id="user.id"
                                :name="user.name"
                                :username="user.username"
                                :avatar="user.avatar"
                                :bio="user.bio"
                                :followers-count="user.followers"
                                :following-count="user.following"
                                :is_following="user.is_following"
                            />
                        </template>
                    </CustomToolTip>
                </NuxtLink>
            </div>

            <!-- Content column -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                        <Publisher :publisher="user" :created-at="createdAt" />
                    </div>

                    <!-- Actions Menu Button -->
                    <div class="relative">
                        <button
                            :id="`tweet-menu-button-${id}`"
                            class="p-1.5 rounded-full hover:bg-hover transition-colors text-secondary hover:text-primary"
                            :aria-label="$t('tweets.moreActions')"
                            @click.stop="toggleActionsMenu"
                        >
                            <MoreHorizontal :size="16" />
                        </button>

                        <ProfileActionsMenu
                            :userid="user.id"
                            :is-tweet="true"
                            @user-action="handleUserAction"
                        />
                    </div>
                </div>

                <Content :content="content" />
                <Stats :stats="stats" @quote="handleQuote" />
            </div>
        </div>
    </article>

    <!-- Quote Modal -->
    <QuoteModal
        :is-open="showQuoteModal"
        :quoted-tweet="tweet"
        @close="showQuoteModal = false"
        @success="handleQuoteSuccess"
    />
</template>

<script setup lang="ts">
import type { Tweet as TweetType } from '../../types/tweet.ts'
import Publisher from './subComponents/Publisher/Publisher.vue'
import Content from './subComponents/Content/Content.vue'
import Stats from './subComponents/Stats/Stats.vue'
import UserCard from './subComponents/Publisher/UserCard.vue'
import QuoteModal from '../QuoteModal/QuoteModal.vue'
import { CustomToolTip } from '~/modules/Common/components/Tooltip/index.js'
import { computed, nextTick, ref, provide } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../utils/navigation'
import { navigateTo } from '#app'
import { Repeat2, MoreHorizontal } from 'lucide-vue-next'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import { useQueryClient } from '@tanstack/vue-query'
import ProfileActionsMenu from '../../../profile/components/ProfileHeader/SubComponents/ProfileActionsMenu.vue'
import { handleImageError } from '~/utils/helpers'
import { useUserStore } from '~/modules/auth/stores/userStore'

const props = defineProps<{
    tweet: TweetType
}>()
const userStore = useUserStore()
const currentUser = computed(() => userStore.getUser())
const showActionsMenu = ref(false)
const showQuoteModal = ref(false)
provide('show-list', showActionsMenu)

const toggleActionsMenu = () => {
    showActionsMenu.value = !showActionsMenu.value
}

const handleQuote = () => {
    showQuoteModal.value = true
}

const handleQuoteSuccess = () => {
    // Quote posted successfully
}

const queryClient = useQueryClient()

const handleUserAction = (action: 'mute' | 'block' | 'unmute' | 'unblock') => {
    // Remove tweets from this user when muted or blocked
    if (action === 'mute' || action === 'block') {
        removeTweetsFromUser(user.value.id)
    }
}

const removeTweetsFromUser = (userId: string) => {
    // Update all tweet queries in the cache
    queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
        if (!oldData) return oldData

        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.filter((tweet: TweetType) => tweet.user.id !== userId),
            })),
        }
    })
}

const tweetTransitionStore = useTweetTransitionStore()
// Use computed properties for reactive access to tweet properties
const id = computed(() => props.tweet.tweet_id)
const repostedUsername = computed(() => {
    return currentUser.value?.user_id === props.tweet.reposted_by?.id
        ? 'You'
        : props.tweet.reposted_by === undefined
          ? 'You'
          : props.tweet.reposted_by.name
})
// Transform content string to Content object
const content = computed(() => ({
    text: props.tweet.content,
    images: props.tweet.images || [],
    videos: props.tweet.videos || [],
    parentTweet:
        props.tweet.type === 'quote'
            ? (props.tweet.parent_tweet ?? props.tweet.quoted_tweet)
            : undefined,
}))

// Transform user to include avatar property
const user = computed(() => ({
    ...props.tweet.user,
    avatar:
        props.tweet.user.avatar_url ?? `https://ui-avatars.com/api/?name=${props.tweet.user.name}`,
}))

// Transform stats to the expected format
const stats = computed(() => ({
    tweet_id: props.tweet.tweet_id,
    likes: props.tweet.likes_count,
    replies: props.tweet.replies_count,
    retweets: props.tweet.reposts_count,
    views: props.tweet.views_count,
    is_liked: props.tweet.is_liked,
    is_reposted: props.tweet.is_reposted,
    is_bookmarked: props.tweet.is_bookmarked,
    username: props.tweet.user.username,
    user_id: props.tweet.user.id,
}))

const createdAt = computed(() => props.tweet.created_at)

// Use utility functions for URLs
const profileUrl = computed(() => getProfileUrl(user.value))
const tweetUrl = computed(() => getTweetUrl(props.tweet))

const navigateToTweet = async () => {
    if (tweetUrl.value !== '#') {
        // Wait for any pending DOM updates to complete
        await nextTick()
        // Store the latest tweet data before navigation
        tweetTransitionStore.setTransitionTweet(props.tweet)
        navigateTo(tweetUrl.value)
    }
}
</script>
