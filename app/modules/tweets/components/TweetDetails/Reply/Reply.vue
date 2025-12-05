<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <article
        :id="`tweet-reply-${id}`"
        class="border-b border-primary px-4 py-3 hover:bg-hover bg-primary transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="shrink-0">
                <NuxtLink :id="`reply-avatar-link-${id}`" @click.stop :to="profileUrl">
                    <CustomToolTip
                        :delay-duration="300"
                        content-class="rounded-2xl shadow-xl border border-primary"
                    >
                        <template #trigger>
                            <img
                                :id="`reply-avatar-${id}`"
                                :src="user.avatar_url"
                                :alt="user.name"
                                class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
                                @error="handleImageError"
                            />
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
                <Publisher :publisher="user" :created-at="reply.created_at" />
                <Content :content="content" />
                <Stats :stats="stats" />
            </div>
        </div>

        <!-- Reply form -->

    </article>
</template>

<script setup lang="ts">
import type { Tweet } from '../../../types/tweet'
import Publisher from '../../Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../../Tweet/subComponents/Content/Content.vue'
import Stats from '../../Tweet/subComponents/Stats/Stats.vue'
import UserCard from '../../Tweet/subComponents/Publisher/UserCard.vue'
import { CustomToolTip } from '~/modules/Common/components/Tooltip/index.js'
import { computed } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../../utils/navigation'
import { navigateTo } from '#app'
import { useTweetTransitionStore } from '../../../stores/tweetTransition'

const props = defineProps<{
    reply: Tweet
}>()

const tweetTransitionStore = useTweetTransitionStore()

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
        props.reply.user.avatar_url || `https://ui-avatars.com/api/?name=${props.reply.user.name}`,
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
}))

// Computed profile URL
const profileUrl = computed(() =>
    getProfileUrl({ username: props.reply.user.username, link: props.reply.user.link }),
)

// Error handling for images
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = `https://ui-avatars.com/api/?name=${props.reply.user.name}`
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
