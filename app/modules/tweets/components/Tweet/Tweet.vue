<template>
    <article
        :id="`tweet-${id}`"
        class="border-b border-primary px-4 py-3 hover:bg-hover bg-primary transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div v-if="tweet.type === 'repost'" class="flex items-center gap-2 mb-2 text-secondary">
            <Repeat2 :size="16" />
            <span class="text-sm">Reposted</span>
        </div>
        
        <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="shrink-0">
                <NuxtLink
                    :id="`tweet-avatar-link-${id}`"
                    @click.stop
                    :to="profileUrl"
                >
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
                                @error="handleImageError"
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
                <Stats :stats="stats"/>
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
import { CustomToolTip } from '~/modules/Common/components/Tooltip/index.js'
import { computed, nextTick } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../utils/navigation'
import { navigateTo } from '#app'
import { Repeat2 } from 'lucide-vue-next'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import { useQueryClient } from '@tanstack/vue-query'


const props = defineProps<{
    tweet: TweetType
}>()

const tweetTransitionStore = useTweetTransitionStore()
const queryClient = useQueryClient()

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
    tweet_id: props.tweet.tweet_id,
    likes: props.tweet.likes_count,
    replies: props.tweet.replies_count,
    retweets: props.tweet.reposts_count,
    views: props.tweet.views_count,
    is_liked: props.tweet.is_liked,
    is_reposted: props.tweet.is_reposted,
}))

const type = computed(() => props.tweet.type)
const createdAt = computed(() => props.tweet.created_at)
const updatedAt = computed(() => props.tweet.updated_at)

// Use utility functions for URLs
const profileUrl = computed(() => getProfileUrl(user.value))
const tweetUrl = computed(() => getTweetUrl(props.tweet))

const navigateToTweet = async () => {
    if (tweetUrl.value !== '#') {
        // Wait for any pending DOM updates to complete
        await nextTick()
        
        // Get the latest tweet data from the cache
        // This ensures we have the most up-to-date like/repost states
        let latestTweet = props.tweet
        
        // const allTweetsQueries = queryClient.getQueriesData({ queryKey: ['tweets'] })
        
        // // Search through all tweets queries to find the latest version of this tweet
        // for (const [queryKey, queryData] of allTweetsQueries) {
        //     const data = queryData as any
        //     if (data?.pages) {
        //         for (const page of data.pages) {
        //             if (page?.data) {
        //                 const foundTweet = page.data.find((t: any) => t.tweet_id === props.tweet.tweet_id)
        //                 if (foundTweet) {
        //                     latestTweet = foundTweet
        //                     break
        //                 }
        //             }
        //         }
        //         if (latestTweet !== props.tweet) break // Found it, stop searching
        //     }
        // }
        
        // Store the latest tweet data before navigation
        tweetTransitionStore.setTransitionTweet(latestTweet)
        navigateTo(tweetUrl.value)
    }
}

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = `https://ui-avatars.com/api/?name=${user.value.name}`
}

</script>
