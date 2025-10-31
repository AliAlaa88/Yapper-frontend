<template>
    <TweetsList :fetchingSource="'/tweets'" />
</template>

<script setup lang="ts">
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
</script>
