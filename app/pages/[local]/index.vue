<template>
    <div class="flex flex-col gap-4 w-full">
        <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
        <PostTweet />
    </div>
</template>

<script setup lang="ts">
import Tabs from '../../modules/Common/components/Tabs'
import PostTweet from '../../modules/TimeLine/components/postTweet'

definePageMeta({
    layout: 'main-layout',
})

const tabs = [
    {
        label: 'For You',
        value: 'foryou',
    },
    {
        label: 'Following',
        value: 'following',
    },
]

const activeTab = ref('foryou')

function handleChange(tab: string) {
    activeTab.value = tab
}
</script>
