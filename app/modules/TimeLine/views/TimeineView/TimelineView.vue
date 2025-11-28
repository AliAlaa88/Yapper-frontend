<template>
    <div class="flex flex-col w-full">
        <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
        <PostTweet :border="true" :tab="activeTab" />
        <TweetsList
            :fetchingSource="`${activeTab === 'foryou' ? '/timeline/for-you' : '/timeline/following'}`"
            class="w-full"
        />
    </div>
</template>

<script setup lang="ts">
import Tabs from '~/modules/Common/components/Tabs'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import { computed } from 'vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

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

watch(
    () => route.query.tab,
    (newTab) => {
        if (newTab === 'following' || newTab === 'foryou') {
            activeTab.value = newTab as string
        } else {
            // Default to 'foryou' if no valid tab param
            activeTab.value = 'foryou'
            router.replace({ query: { ...route.query, tab: 'foryou' } })
        }
    },
    { immediate: true },
)

function handleChange(tab: string) {
    activeTab.value = tab
    router.push({ query: { ...route.query, tab } })
}
</script>
