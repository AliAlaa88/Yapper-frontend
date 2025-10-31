<template>
    <article
        class="border-b border-[var(--color-x-border)] px-4 py-3 hover:bg-[var(--color-x-background)] transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div class="flex gap-3">
            <!-- Avatar column -->
            <TooltipProvider :delay-duration="300">
                <div class="h-fit">
                    <NuxtLink 
                        class="flex-shrink-0" 
                        @click.stop
                        :to="profileUrl"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <img 
                                    :src="user.avatar" 
                                    :alt="user.name" 
                                    class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
                                />
                            </TooltipTrigger>
                            <TooltipContent class="p-0">
                                <UserCard
                                    :id="user.id"
                                    :name="user.name"
                                    :username="user.username"
                                    :avatar="user.avatar"
                                    :bio="user.bio"
                                    :followers-count="user.followers_count"
                                    :following-count="user.following_count"
                                />
                            </TooltipContent>
                        </Tooltip>
                    </NuxtLink> 
                </div>
            </TooltipProvider>

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { computed } from 'vue'
import { getProfileUrl, getTweetUrl } from '../../utils/navigation'
import { navigateTo } from '#app'

const props = defineProps<{
    tweet: TweetType
}>()

// Use computed properties for reactive access to tweet properties
const id = computed(() => props.tweet.id)
const content = computed(() => props.tweet.content)
const user = computed(() => props.tweet.user)
const stats = computed(() => props.tweet.stats)
const type = computed(() => props.tweet.type)
const createdAt = computed(() => props.tweet.createdAt)
const updatedAt = computed(() => props.tweet.updatedAt)

// Use utility functions for URLs
const profileUrl = computed(() => getProfileUrl(user.value))
const tweetUrl = computed(() => getTweetUrl(props.tweet))

const navigateToTweet = () => {
    if (tweetUrl.value !== '#') {
        console.log('Navigating to tweet:', tweetUrl.value)
        navigateTo(tweetUrl.value)
    }
}

</script>
