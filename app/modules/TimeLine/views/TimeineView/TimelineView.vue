<template>
    <div class="flex flex-col w-full">
        <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
        <PostTweet :border="true" />
        <TweetsList fetchingSource="tweets" class="w-full" />
    </div>
</template>

<script setup lang="ts">
import Tabs from '~/modules/Common/components/Tabs'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import { isLoggedIn } from '~/utils/helpers'
import { onMounted } from 'vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
const router = useRouter()

onMounted(() => {
    if (!isLoggedIn()) {
        router.push('/auth')
    }
})

const tabs = [
    {
        label: 'For You',
        value: 'foryou',
        test_id: 'timeline-view-foryou-tab',
    },
    {
        label: 'Following',
        value: 'following',
        test_id: 'timeline-view-following-tab',
    },
]

const activeTab = ref('foryou')

function handleChange(tab: string) {
    activeTab.value = tab
}

// onMounted(() => {
//     const userStore = useUserStore()
//     const home = 'home'
//     if (!userStore.isLoggedIn) {
//         router.push(`/${home}`)
//     } else {
//         router.push('/auth')
//     }
// })
</script>
