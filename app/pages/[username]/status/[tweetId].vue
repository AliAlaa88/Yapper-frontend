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
import { useTweetPageSeo } from '~/modules/tweets/composables/useTweetPageSeo'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})

const route = useRoute()

const hasChildRoute = computed(() => {
    return route.matched.length > 1 && route.matched[route.matched.length - 1]?.path.includes('/')
})

useTweetPageSeo()
</script>