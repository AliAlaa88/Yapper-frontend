<template>
    <div class="max-w-[600px] mx-auto border-x border-primary bg-primary min-h-screen">
        <!-- Slot for child routes or default content -->
        <NuxtPage v-slot="{ Component }">
            <component :is="Component" />
        </NuxtPage>

        <!-- Tweet Details Component (shown when no child route) -->
        <TweetDetails v-if="!hasChildRoute" />
    </div>
</template>

<script setup lang="ts">
import TweetDetails from '~/modules/tweets/components/TweetDetails/TweetDetails.vue'
import { computed } from 'vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})

// Set page metadata
const route = useRoute()
const username = computed(() => route.params.username as string)
const tweetId = computed(() => route.params.tweetId as string)

// Determine if this is a child route (like /quotes)
const hasChildRoute = computed(() => {
    return route.matched.length > 1 && route.matched[route.matched.length - 1].path.includes('/')
})

// Set dynamic head for SEO
useHead({
    title: `Tweet by @${username.value}`,
    meta: [{ name: 'description', content: `View tweet by @${username.value}` }],
})
</script>
