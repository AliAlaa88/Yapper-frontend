<template>
    <article
        class="border-b border-[var(--color-x-border)] px-4 py-3 hover:bg-[var(--color-x-background)] transition-colors cursor-pointer"
        @click="navigateToTweet"
    >
        <div class="flex gap-3">
            <!-- Avatar column -->
            <a 
                class="flex-shrink-0" 
                @click.stop="navigateToUser"
                :href="user.username ? `/${user.username}` : '#'"
                @click.prevent
            >
                <img 
                    :src="user.avatar" 
                    :alt="user.name" 
                    class="w-10 h-10 rounded-full cursor-pointer hover:brightness-95 transition-all"
                />
            </a>

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
import type { Tweet as TweetType } from '~/modules/tweets/types'
import Publisher from './subComponents/Publisher/Publisher.vue'
import Content from './subComponents/Content/Content.vue'
import Stats from './subComponents/Stats/Stats.vue'
import { toRefs } from 'vue'

const props = defineProps<{
    tweet: TweetType
}>()

const { id, content, user, stats, type, createdAt, updatedAt } = toRefs(props.tweet)

const navigateToTweet = () => {
    navigateTo(`/tweet/${id.value}`)
}

const navigateToUser = (event: Event) => {
    event.stopPropagation()
    console.log('Navigating to user:', user.value)
    navigateTo(`/${user.value.username}`)
}

</script>
