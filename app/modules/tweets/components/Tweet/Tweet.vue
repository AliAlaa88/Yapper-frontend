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

        <!-- Thread view for replies with parent_tweet -->
        <template v-if="tweet.type === 'reply' && tweet.parent_tweet">
            <!-- Parent Tweet -->
            <div class="flex gap-3 mb-0">
                <!-- Parent Avatar column with thread line -->
                <div class="shrink-0 flex flex-col items-center">
                    <NuxtLink :to="getProfileUrl(parentUser)" @click.stop>
                        <img
                            :src="parentUser.avatar"
                            :alt="parentUser.name"
                            class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
                            @error="(event) => handleImageError(parentUser.name, event)"
                        />
                    </NuxtLink>
                    <!-- Thread connecting line -->
                    <div class="w-0.5 flex-1 bg-gray-600 mt-1 min-h-5" />
                </div>

                <!-- Parent Content column -->
                <div class="flex-1 min-w-0 pb-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <Publisher
                                :publisher="parentUser"
                                :created-at="tweet.parent_tweet.created_at"
                            />
                        </div>
                    </div>
                    <Content :content="parentContent" />
                    <Stats :stats="parentStats" />
                </div>
            </div>

            <!-- Reply Tweet (current tweet) -->
            <div class="flex gap-3">
                <!-- Reply Avatar column -->
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
                            <template #content="{ isOpen }">
                                <UserCard
                                    :id="user.id"
                                    :name="user.name"
                                    :username="user.username"
                                    :avatar="user.avatar"
                                    :bio="user.bio"
                                    :followers-count="user.followers"
                                    :following-count="user.following"
                                    :is_following="user.is_following"
                                    :is-open="isOpen"
                                />
                            </template>
                        </CustomToolTip>
                    </NuxtLink>
                </div>

                <!-- Reply Content column -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <Publisher :publisher="user" :created-at="createdAt" />
                        </div>

                        <!-- AI Summary and Actions Menu Buttons -->
                        <div class="flex items-center gap-1">
                            <!-- AI Summary Button -->
                            <button
                                v-if="ShowAIButton"
                                :id="`tweet-ai-summary-${id}`"
                                class="p-1.5 rounded-full hover:bg-blue/10 transition-colors text-secondary hover:text-blue"
                                :class="{ 'text-blue': showSummary }"
                                :aria-label="$t('tweets.aiSummary')"
                                :disabled="isSummaryLoading"
                                @click.stop="toggleSummary"
                            >
                                <Sparkles v-if="!isSummaryLoading" :size="16" />
                                <LoadingSpinner v-else size="sm" color="blue" />
                            </button>

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

                                <!-- Show MyTweetActionsMenu for own tweets, ProfileActionsMenu for others -->
                                <MyTweetActionsMenu
                                    v-if="showActionsMenu && isOwnTweet"
                                    :tweet-id="tweet.tweet_id"
                                    @edit="onEdit"
                                    @delete="onDelete"
                                />
                                <ProfileActionsMenu
                                    v-else-if="showActionsMenu"
                                    :userid="user.id"
                                    :is-tweet="true"
                                    @user-action="handleUserAction"
                                />
                            </div>
                        </div>
                    </div>

                    <Content :content="content" />

                    <!-- AI Summary Section -->
                    <div
                        v-if="showSummary && summaryData"
                        class="mb-3 p-3 bg-blue/5 border border-blue/20 rounded-xl"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <Sparkles :size="14" class="text-blue" />
                            <span class="text-sm font-medium text-blue">{{
                                $t('tweets.aiSummary')
                            }}</span>
                        </div>
                        <p class="text-primary text-sm leading-relaxed">
                            {{ summaryData.summary }}
                        </p>
                    </div>

                    <Stats :stats="stats" @quote="handleQuote" @reply="handleReply" />
                </div>
            </div>
        </template>

        <!-- Standard tweet view (non-reply or reply without parent_tweet) -->
        <div v-else class="flex gap-3">
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
                        <template #content="{ isOpen }">
                            <UserCard
                                :id="user.id"
                                :name="user.name"
                                :username="user.username"
                                :avatar="user.avatar"
                                :bio="user.bio"
                                :followers-count="user.followers"
                                :following-count="user.following"
                                :is_following="user.is_following"
                                :is-open="isOpen"
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

                    <!-- AI Summary and Actions Menu Buttons -->
                    <div class="flex items-center gap-1">
                        <!-- AI Summary Button -->
                        <button
                            v-if="ShowAIButton"
                            :id="`tweet-ai-summary-${id}`"
                            class="p-1.5 rounded-full hover:bg-blue/10 transition-colors text-secondary hover:text-blue"
                            :class="{ 'text-blue': showSummary }"
                            :aria-label="$t('tweets.aiSummary')"
                            :disabled="isSummaryLoading"
                            @click.stop="toggleSummary"
                        >
                            <Sparkles v-if="!isSummaryLoading" :size="16" />
                            <LoadingSpinner v-else size="sm" color="blue" />
                        </button>

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

                            <!-- Show MyTweetActionsMenu for own tweets, ProfileActionsMenu for others -->
                            <MyTweetActionsMenu
                                v-if="showActionsMenu && isOwnTweet"
                                :tweet-id="tweet.tweet_id"
                                @edit="onEdit"
                                @delete="onDelete"
                            />
                            <ProfileActionsMenu
                                v-else-if="showActionsMenu"
                                :userid="user.id"
                                :is-tweet="true"
                                @user-action="handleUserAction"
                            />
                        </div>
                    </div>
                </div>

                <Content :content="content" />

                <!-- AI Summary Section -->
                <div
                    v-if="showSummary && (summaryData || summaryError)"
                    class="mb-3 p-3 bg-blue/5 border border-blue/20 rounded-xl"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <Sparkles :size="14" class="text-blue" />
                        <span class="text-sm font-medium text-blue">{{
                            $t('tweets.aiSummary')
                        }}</span>
                    </div>
                    <p class="text-primary text-sm leading-relaxed">
                        {{ summaryError ? $t('tweets.aiError') : summaryData?.summary }}
                    </p>
                </div>

                <Stats :stats="stats" @quote="handleQuote" @reply="handleReply" />
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

    <!-- Reply Modal -->
    <ReplyModal
        :is-open="showReplyModal"
        :parent-tweet="tweet"
        @close="showReplyModal = false"
        @success="handleReplySuccess"
    />

    <!-- Edit Tweet Modal -->
    <EditTweetModal
        :is-open="showEditModal"
        :tweet-id="tweet.tweet_id"
        :initial-content="tweet.content"
        :is-loading="isUpdateLoading"
        @close="handleCloseEditModal"
        @save="handleSaveEdit"
    />
</template>

<script setup lang="ts">
import type { Tweet as TweetType } from '../../types/tweet.ts'
import Publisher from './subComponents/Publisher/Publisher.vue'
import Content from './subComponents/Content/Content.vue'
import Stats from './subComponents/Stats/Stats.vue'
import UserCard from './subComponents/Publisher/UserCard.vue'
import QuoteModal from '../QuoteModal/QuoteModal.vue'
import ReplyModal from '../ReplyModal/ReplyModal.vue'
import EditTweetModal from '../EditTweetModal/EditTweetModal.vue'
import MyTweetActionsMenu from './subComponents/MyTweetActionsMenu/MyTweetActionsMenu.vue'
import { CustomToolTip } from '~/modules/Common/components/Tooltip/index.js'
import { computed, nextTick, ref, provide, inject, type Ref } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../utils/navigation'
import { navigateTo } from '#app'
import { Repeat2, MoreHorizontal, Sparkles } from 'lucide-vue-next'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import { useQueryClient } from '@tanstack/vue-query'
import ProfileActionsMenu from '../../../profile/components/ProfileHeader/SubComponents/ProfileActionsMenu.vue'
import { handleImageError } from '~/utils/helpers'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useTweetActions } from '../../composables/useTweetActions'
import { useTweetSummaryQuery } from '../../queries/useTweetQueries'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'

const props = defineProps<{
    tweet: TweetType
}>()
const userStore = useUserStore()
const currentUser = computed(() => userStore.getUser())

// Inject shared active menu state from TweetsList (only one menu open at a time)
const activeMenuTweetId = inject<Ref<string | null>>('activeMenuTweetId', ref(null))

// Computed to check if this tweet's menu is the active one
const showActionsMenu = computed(() => activeMenuTweetId.value === props.tweet.tweet_id)
const ShowAIButton = computed(() => (props.tweet.content?.length ?? 0) > 150)
const showQuoteModal = ref(false)
const showReplyModal = ref(false)
const showSummary = ref(false)
provide('show-list', showActionsMenu)

// AI Summary query - only fetch when user requests it
const shouldFetchSummary = ref(false)
const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    error: summaryError,
} = useTweetSummaryQuery(props.tweet.tweet_id, shouldFetchSummary.value)

const toggleSummary = async () => {
    if (!showSummary.value) {
        // First time clicking - fetch the summary
        if (!summaryData.value) {
            shouldFetchSummary.value = true
            await refetchSummary()
        }
        showSummary.value = true
    } else {
        showSummary.value = false
    }
}

// Tweet actions composable
const tweetId = computed(() => props.tweet.tweet_id)
const {
    handleDeleteWithConfirmation,
    handleEdit,
    handleSaveEdit,
    handleCloseEditModal,
    showEditModal,
    isUpdateLoading,
} = useTweetActions(tweetId)

// Check if the tweet belongs to the current user
const isOwnTweet = computed(() => {
    return currentUser.value?.user_id === props.tweet.user.id
})

const toggleActionsMenu = () => {
    // Toggle: if this tweet's menu is open, close it; otherwise open it (closing any other)
    if (activeMenuTweetId.value === props.tweet.tweet_id) {
        activeMenuTweetId.value = null
    } else {
        activeMenuTweetId.value = props.tweet.tweet_id
    }
}

const handleQuote = () => {
    showQuoteModal.value = true
}

const handleReply = () => {
    showReplyModal.value = true
}

const handleQuoteSuccess = () => {
    // Quote posted successfully
}

const handleReplySuccess = () => {
    // Reply posted successfully
}

const queryClient = useQueryClient()

// Handlers for own tweet actions
const onEdit = () => handleEdit(showActionsMenu)
const onDelete = () => handleDeleteWithConfirmation(showActionsMenu)

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
    parentTweet: props.tweet.type === 'quote' ? props.tweet.parent_tweet : undefined,
}))

// Transform user to include avatar property
const user = computed(() => ({
    ...props.tweet.user,
    avatar:
        props.tweet.user.avatar_url ?? `https://ui-avatars.com/api/?name=${props.tweet.user.name}`,
}))

// Parent tweet user for thread view
const parentUser = computed(() => {
    if (!props.tweet.parent_tweet?.user) return null
    return {
        ...props.tweet.parent_tweet.user,
        avatar:
            props.tweet.parent_tweet.user.avatar_url ??
            `https://ui-avatars.com/api/?name=${props.tweet.parent_tweet.user.name}`,
    }
})

// Parent tweet content for thread view
const parentContent = computed(() => {
    if (!props.tweet.parent_tweet) {
        return { text: '', images: [], videos: [] }
    }
    return {
        text: props.tweet.parent_tweet.content,
        images: props.tweet.parent_tweet.images || [],
        videos: props.tweet.parent_tweet.videos || [],
    }
})

const parentStats = computed(() => {
    if (!props.tweet.parent_tweet) {
        return {
            tweet_id: '',
            likes: 0,
            replies: 0,
            retweets: 0,
            views: 0,
            is_liked: false,
            is_reposted: false,
            is_bookmarked: false,
            username: '',
            user_id: '',
        }
    }
    return {
        tweet_id: props.tweet.parent_tweet.tweet_id,
        likes: props.tweet.parent_tweet.likes_count,
        replies: props.tweet.parent_tweet.replies_count,
        retweets: props.tweet.parent_tweet.reposts_count,
        views: props.tweet.parent_tweet.views_count,
        is_liked: props.tweet.parent_tweet.is_liked,
        is_reposted: props.tweet.parent_tweet.is_reposted,
        is_bookmarked: props.tweet.parent_tweet.is_bookmarked,
        username: props.tweet.parent_tweet.user.username,
        user_id: props.tweet.parent_tweet.user.id,
    }
})
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
