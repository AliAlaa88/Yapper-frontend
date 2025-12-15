<template>
    <div class="flex flex-col w-full">
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md">
            <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
        </div>

        <PostTweet :border="true" :inlineborder="true" />
        <TweetsList
            :fetchingSource="`${activeTab === 'foryou' ? '/timeline/for-you' : '/timeline/following'}`"
            class="w-full"
        />
    </div>
</template>

<script setup lang="ts">
import Tabs from '~/modules/Common/components/Tabs'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import { onMounted, computed } from 'vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/modules/auth/stores/userStore'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
    if (!userStore.isLoggedIn) {
        router.push('/auth')
    }
})

const tabs = computed(() => [
    {
        label: t('timeline.timelineView.forYou'),
        value: 'foryou',
        test_id: 'timeline-view-foryou-tab',
    },
    {
        label: t('timeline.timelineView.following'),
        value: 'following',
        test_id: 'timeline-view-following-tab',
    },
])

const activeTab = ref('foryou')

function handleChange(tab: string) {
    activeTab.value = tab
}
</script>
