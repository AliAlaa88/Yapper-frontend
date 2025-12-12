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
                :quotes="true"
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
                        v-for="user in users as FollowUser[]"
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
            <UserList
                v-else-if="currentTab === 'likes' && tweetId"
                :fetching-source="`tweets/${tweetId}/likes`"
                query-key-prefix="tweet-likes"
                :loading-text="$t('messages.loading')"
                :error-text="$t('messages.error')"
                :retry-text="$t('tweets.errors.tryAgain')"
                :empty-title="$t('tweets.empty.noLikes')"
                :empty-description="$t('tweets.empty.noLikesDescription')"
            >
                <template #default="{ users }">
                    <FollowListUserCard
                        v-for="user in users as FollowUser[]"
                        :key="user.user_id"
                        :user="user"
                    />
                </template>

                <template #empty>
                    <div class="text-center py-12 text-secondary">
                        <Repeat2 class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
                        <p class="text-lg text-primary">{{ $t('tweets.empty.noLikes') }}</p>
                        <p class="text-sm mt-1">{{ $t('tweets.empty.noLikesDescription') }}</p>
                    </div>
                </template>
            </UserList>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Repeat2 } from 'lucide-vue-next'
import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { UserList } from '~/modules/Common/components/UserList'
import FollowListUserCard from '~/modules/Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import { useTweetDetails } from '../../composables/useTweetDetails'
import { useUserStore } from '~/modules/auth/stores/userStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tweetTransitionStore = useTweetTransitionStore()
const userStore = useUserStore()

const tweetId = computed(() => route.params.tweetId as string)
const username = computed(() => route.params.username as string)

// Fetch tweet details to determine isOwnTweet
const { tweetDetails } = useTweetDetails(tweetId.value)

// Compute isOwnTweet from fetched data only
const isOwnTweet = computed(() => {
    if (!tweetDetails.value) return false
    return tweetDetails.value.user.id === userStore.getUser()?.user_id
})

const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/retweets')) return 'retweets'
    if (path.endsWith('/likes')) return 'likes'
    return 'quotes'
})

const tabsConfig = computed(() => {
    const tabs = [
        { label: t('tweets.actions.quote'), value: 'quotes', test_id: 'tab-quotes' },
        { label: t('tweets.actions.retweet'), value: 'retweets', test_id: 'tab-retweets' },
    ]

    if (config.public.env === 'development')
        console.log('isOwnTweet', 'currentTab', currentTab.value, isOwnTweet.value)

    if (isOwnTweet.value) {
        tabs.push({ label: t('tweets.actions.likes'), value: 'likes', test_id: 'tab-likes' })
    }
    return tabs
})

const handleTabChange = (tab: string) => {
    const newPath = `/${username.value}/status/${tweetId.value}/${tab}`
    router.push(newPath)
}
</script>
