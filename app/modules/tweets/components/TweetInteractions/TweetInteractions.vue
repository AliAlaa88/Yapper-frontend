<template>
    <div class="bg-primary">
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md">
            <div class="flex items-center gap-8 px-4 py-3">
                <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover"
                    :aria-label="$t('navigation.back')"
                    @click="router.back()"
                >
                    <ArrowLeft :size="20" class="text-primary" />
                </button>
                <div class="flex flex-col">
                    <h2 class="text-xl font-bold text-primary">
                        {{ $t('tweets.postEngagements') }}
                    </h2>
                </div>
            </div>
            <Tabs :tabs="tabsConfig" :active-tab="currentTab" :on-change="handleTabChange" />
        </div>

        <div class="min-h-screen">
            <TweetsList
                v-if="currentTab === 'quotes' && tweetId"
                :fetching-source="`tweets/${tweetId}/quotes`"
            />
            <UserList
                v-else-if="currentTab === 'retweets' && tweetId"
                :fetching-source="`tweets/${tweetId}/reposts`"
                query-key-prefix="tweet-reposts"
                :loading-text="$t('messages.loading')"
                :error-text="$t('messages.error')"
                :retry-text="$t('tweets.errors.tryAgain')"
                :empty-title="$t('tweets.empty.noReposts')"
                :empty-description="$t('tweets.empty.norepostsDescription')"
            >
                <template #default="{ users }">
                    <FollowListUserCard
                        v-for="user in (users as FollowUser[])"
                        :key="user.user_id"
                        :user="user"
                    />
                </template>

                <template #empty>
                    <div class="text-center py-12 text-secondary">
                        <Repeat2 class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
                        <p class="text-lg text-primary">{{ $t('tweets.empty.noReposts') }}</p>
                        <p class="text-sm mt-1">{{ $t('tweets.empty.norepostsDescription') }}</p>
                    </div>
                </template>
            </UserList>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Repeat2 } from 'lucide-vue-next'
import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { UserList } from '~/modules/Common/components/UserList'
import FollowListUserCard from '~/modules/Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const tweetId = computed(() => route.params.tweetId as string)
const username = computed(() => route.params.username as string)

const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/retweets')) return 'retweets'
    return 'quotes'
})

const tabsConfig = computed(() => [
    { label: t('tweets.actions.quote'), value: 'quotes', test_id: 'tab-quotes' },
    { label: t('tweets.actions.retweet'), value: 'retweets', test_id: 'tab-retweets' },
])

const handleTabChange = (tab: string) => {
    const newPath = `/${username.value}/status/${tweetId.value}/${tab}`
    router.push(newPath)
}
</script>
