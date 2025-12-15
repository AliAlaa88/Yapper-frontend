<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <article
        :id="`tweet-reply-${id}`"
        :class="[
            'px-4 py-3 hover:bg-hover bg-primary transition-colors cursor-pointer',
            { 'border-b border-primary': !hasNestedReplies },
        ]"
        @click="navigateToTweet"
    >
        <div class="flex gap-3">
            <!-- Avatar column with connecting line -->
            <div class="shrink-0 relative">
                <!-- Connecting line to nested replies -->
                <div
                    v-if="hasNestedReplies"
                    class="absolute left-1/2 top-10 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 -translate-x-1/2"
                    style="height: calc(100% + 12px)"
                />
                <NuxtLink :id="`reply-avatar-link-${id}`" :to="profileUrl" @click.stop>
                    <CustomToolTip
                        :delay-duration="300"
                        content-class="rounded-2xl shadow-xl border border-primary"
                    >
                        <template #trigger>
                            <img
                                :id="`reply-avatar-${id}`"
                                :src="user.avatar_url"
                                :alt="user.name"
                                class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all relative z-0"
                                @error="handleImageError"
                            >
                        </template>
                        <template #content>
                            <UserCard
                                :id="user.id"
                                :name="user.name"
                                :username="user.username"
                                :avatar="user.avatar_url"
                                :bio="user.bio"
                                :followers-count="user.followers"
                                :following-count="user.following"
                            />
                        </template>
                    </CustomToolTip>
                </NuxtLink>
            </div>

            <!-- Content column -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-1">
                        <Publisher :publisher="user" :created-at="reply.created_at" />
                    </div>

                    <!-- Actions Menu Button -->
                    <div class="relative">
                        <button
                            :id="`reply-menu-button-${id}`"
                            class="p-1.5 rounded-full hover:bg-hover transition-colors text-secondary hover:text-primary"
                            :aria-label="$t('tweets.moreActions')"
                            @click.stop="toggleActionsMenu"
                        >
                            <MoreHorizontal :size="16" />
                        </button>

                        <!-- Show MyTweetActionsMenu for own tweets, ProfileActionsMenu for others -->
                        <MyTweetActionsMenu
                            v-if="showActionsMenu && isOwnReply"
                            :tweet-id="reply.tweet_id"
                            @edit="onEdit"
                            @delete="onDelete"
                        />
                        <ProfileActionsMenu
                            v-else-if="showActionsMenu"
                            :userid="reply.user.id"
                            :is-tweet="true"
                            @user-action="handleUserAction"
                        />
                    </div>
                </div>
                <Content :content="content" />
                <Stats :stats="stats" />
            </div>
        </div>

        <!-- Edit Tweet Modal -->
        <EditTweetModal
            :is-open="showEditModal"
            :tweet-id="reply.tweet_id"
            :initial-content="reply.content"
            :is-loading="isUpdateLoading"
            @close="handleCloseEditModal"
            @save="handleSaveEdit"
        />
    </article>

    <!-- Nested Replies -->
    <div v-if="hasNestedReplies">
        <Reply
            v-for="nestedReply in props.reply.replies"
            :key="nestedReply.tweet_id"
            :reply="nestedReply"
            :depth="(depth || 0) + 1"
        />
    </div>
</template>

<script setup lang="ts">
import type { Tweet } from '../../../types/tweet'
import Publisher from '../../Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../../Tweet/subComponents/Content/Content.vue'
import Stats from '../../Tweet/subComponents/Stats/Stats.vue'
import UserCard from '../../Tweet/subComponents/Publisher/UserCard.vue'
import { CustomToolTip } from '~/modules/Common/components/Tooltip/index.js'
import { computed, ref, provide } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../../utils/navigation'
import { navigateTo } from '#app'
import { useTweetTransitionStore } from '../../../stores/tweetTransition'
import { MoreHorizontal } from 'lucide-vue-next'
import MyTweetActionsMenu from '../../Tweet/subComponents/MyTweetActionsMenu/MyTweetActionsMenu.vue'
import ProfileActionsMenu from '../../../../profile/components/ProfileHeader/SubComponents/ProfileActionsMenu.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useTweetActions } from '../../../composables/useTweetActions'
import EditTweetModal from '../../EditTweetModal/EditTweetModal.vue'

const props = defineProps<{
    reply: Tweet
    depth?: number
}>()

const tweetTransitionStore = useTweetTransitionStore()
const userStore = useUserStore()

// Get parent tweet ID from route for cache invalidation
const route = useRoute()
const parentTweetId = computed(() => route.params.tweetId as string)

// Actions menu state
const showActionsMenu = ref(false)
provide('show-list', showActionsMenu)

// Check if this reply belongs to the current user
const isOwnReply = computed(() => {
    return props.reply.user.id === userStore.getUser()?.user_id
})

// Use tweet actions composable for edit/delete functionality
const tweetId = computed(() => props.reply.tweet_id)
const {
    handleDeleteWithConfirmation,
    handleEdit,
    handleSaveEdit,
    handleCloseEditModal,
    showEditModal,
    isUpdateLoading,
} = useTweetActions(tweetId, parentTweetId)

// Toggle actions menu
const toggleActionsMenu = () => {
    showActionsMenu.value = !showActionsMenu.value
}

// Handlers for own tweet actions
const onEdit = () => handleEdit(showActionsMenu)
const onDelete = () => handleDeleteWithConfirmation(showActionsMenu)

// Handle user actions (mute/block)
const handleUserAction = (_action: string) => {
    showActionsMenu.value = false
}

// Computed to check if there are nested replies
const hasNestedReplies = computed(() => props.reply.replies && props.reply.replies.length > 0)

// Use computed properties for reactive access
const id = computed(() => props.reply.tweet_id)

// Transform content
const content = computed(() => ({
    text: props.reply.content,
    images: props.reply.images || [],
    videos: props.reply.videos || [],
    gifs: props.reply.gifs || [],
}))

// Transform user with avatar fallback
const user = computed(() => ({
    ...props.reply.user,
    avatar_url:
        props.reply.user.avatar_url ||
        `https://ui-avatars.com/api/?name=${props.reply.user.name}&background=random`,
}))

// Transform stats
const stats = computed(() => ({
    tweet_id: props.reply.tweet_id,
    likes: props.reply.likes_count,
    replies: props.reply.replies_count,
    retweets: props.reply.reposts_count,
    views: props.reply.views_count,
    is_liked: props.reply.is_liked,
    is_reposted: props.reply.is_reposted,
    is_bookmarked: props.reply.is_bookmarked,
    username: props.reply.user.username,
    user_id: props.reply.user.id,
}))

// Computed profile URL
const profileUrl = computed(() =>
    getProfileUrl({ username: props.reply.user.username, link: props.reply.user.link }),
)

// Error handling for images
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = `https://ui-avatars.com/api/?name=${props.reply.user.name}&background=random`
}

// Navigation handler
const navigateToTweet = () => {
    // Store the reply tweet for smooth transition
    tweetTransitionStore.setTransitionTweet(props.reply)

    // Navigate to the tweet detail page
    navigateTo(
        getTweetUrl({
            user: { username: props.reply.user.username },
            tweet_id: props.reply.tweet_id,
        }),
    )
}
</script>
