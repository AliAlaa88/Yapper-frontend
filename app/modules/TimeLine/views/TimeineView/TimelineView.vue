<template>
    <div class="flex flex-col gap-4 w-full">
        <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
        <PostTweet :border="true" />
    </div>
</template>

<script setup lang="ts">
import Tabs from '~/modules/Common/components/Tabs'
import PostTweet from '~/modules/TimeLine/components/postTweet'
// import { onMounted } from 'vue'
// import { useRouter } from 'vue-router'
// import { useUserStore } from '~/modules/auth/stores/userStore'


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

// const router = useRouter()
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
