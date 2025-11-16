<template>
    <article
        :id="`tweet-${id}`"
        class="border-b border-x-border px-4 py-3 hover:bg-hover dark:hover:bg-hover bg-primary transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="h-fit">
                <NuxtLink
                    :id="`tweet-avatar-link-${id}`"
                    class="shrink-0"
                    @click.stop
                    :to="profileUrl"
                >
                    <CustomToolTip
                        :delay-duration="300"
                        content-class="rounded-2xl shadow-xl border border-x-border"
                    >
                        <template #trigger>
                            <img
                                :id="`tweet-avatar-${id}`"
                                :src="user.avatar"
                                :alt="user.name"
                                class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
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
                            />
                        </template>
                    </CustomToolTip>
                </NuxtLink>
            </div>

            <!-- Content column -->
            <div class="flex-1 min-w-0">
                <Publisher :publisher="user" :created-at="createdAt" />
                <Content :content="content" />
                <Stats :stats="stats" />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import type { Tweet as TweetType } from '../../types/tweet.ts'
import Publisher from './subComponents/Publisher/Publisher.vue'
import Content from './subComponents/Content/Content.vue'
import Stats from './subComponents/Stats/Stats.vue'
import UserCard from './subComponents/Publisher/UserCard.vue'
import { CustomToolTip } from '~/components/ui/tooltip'
import { computed } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../utils/navigation'
import { navigateTo } from '#app'

const props = defineProps<{
    tweet: TweetType
}>()

// Use computed properties for reactive access to tweet properties
const id = computed(() => props.tweet.tweet_id)

// Transform content string to Content object
const content = computed(() => ({
    text: props.tweet.content,
    images: props.tweet.images || [],
    videos: props.tweet.videos || [],
}))

// Transform user to include avatar property
const user = computed(() => ({
    ...props.tweet.user,
    avatar:
        props.tweet.user.avatar_url ?? `https://ui-avatars.com/api/?name=${props.tweet.user.name}`,
}))

// Transform stats to the expected format
const stats = computed(() => ({
    likes: props.tweet.likes_count,
    replies: props.tweet.replies_count,
    retweets: props.tweet.reposts_count,
    views: props.tweet.views_count,
}))

const type = computed(() => props.tweet.type)
const createdAt = computed(() => props.tweet.created_at)
const updatedAt = computed(() => props.tweet.updated_at)

// Use utility functions for URLs
const profileUrl = computed(() => getProfileUrl(user.value))
const tweetUrl = computed(() => getTweetUrl(props.tweet))

const navigateToTweet = () => {
    if (tweetUrl.value !== '#') {
        navigateTo(tweetUrl.value)
    }
}
</script>
