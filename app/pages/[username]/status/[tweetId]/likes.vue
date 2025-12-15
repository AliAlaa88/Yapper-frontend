<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <TweetInteractions />
</template>

<script setup lang="ts">
import TweetInteractions from '~/modules/tweets/components/TweetInteractions/TweetInteractions.vue'
import { useTweetPageSeo } from '~/modules/tweets/composables/useTweetPageSeo'

useTweetPageSeo('likes')

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>
