<template>
    <div>
        <!-- Tab Navigation -->
        <div class="flex border-b border-primary bg-primary sticky top-[57px] z-10">
            <button
                :class="[
                    'flex-1 py-3 text-center font-semibold transition-colors border-b-2',
                    activeTab === 'quotes'
                        ? 'text-blue border-blue'
                        : 'text-secondary border-transparent hover:bg-hover',
                ]"
                @click="activeTab = 'quotes'"
            >
                {{ $t('tweets.actions.quote') }} ({{ quotesCount }})
            </button>
            <button
                :class="[
                    'flex-1 py-3 text-center font-semibold transition-colors border-b-2',
                    activeTab === 'reposts'
                        ? 'text-blue border-blue'
                        : 'text-secondary border-transparent hover:bg-hover',
                ]"
                @click="activeTab = 'reposts'"
            >
                {{ $t('tweets.actions.retweet') }} ({{ repostsCount }})
            </button>
        </div>

        <!-- Content -->
        <div v-if="isLoading" class="p-8 text-center">
            <div class="flex justify-center mb-4">
                <LoadingSpinner size="xl" color="blue" />
            </div>
            <p class="text-secondary">{{ $t('tweets.loading.tweets') }}</p>
        </div>

        <!-- Quotes Tab -->
        <div v-else-if="activeTab === 'quotes'">
            <div v-if="quotesList.length === 0" class="text-center py-12 text-secondary">
                <MessageCircle class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
                <p class="text-lg text-primary">{{ $t('tweets.empty.noQuotes') }}</p>
                <p class="text-sm mt-1">{{ $t('tweets.empty.noQuotesDescription') }}</p>
            </div>
            <div v-else>
                <Tweet v-for="quote in quotesList" :key="quote.tweet_id" :tweet="quote" />
            </div>
        </div>

        <!-- Reposts Tab -->
        <div v-else-if="activeTab === 'reposts'">
            <div v-if="repostsList.length === 0" class="text-center py-12 text-secondary">
                <Repeat2 class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
                <p class="text-lg text-primary">{{ $t('tweets.empty.noReposts') }}</p>
                <p class="text-sm mt-1">{{ $t('tweets.empty.norepostsDescription') }}</p>
            </div>
            <div v-else>
                <UserCard v-for="repost in repostsList" :key="repost.id" :user="repost" />
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-8 text-center">
            <AlertTriangle class="w-16 h-16 text-red mx-auto mb-4" :stroke-width="1" />
            <p class="text-red text-lg">
                {{ error instanceof Error ? error.message : $t('tweets.errors.loadFailed') }}
            </p>
            <button
                class="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors duration-200"
                @click="refetch"
            >
                {{ $t('tweets.errors.tryAgain') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#app'
import { MessageCircle, AlertTriangle, Repeat2 } from 'lucide-vue-next'
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import UserCard from '~/modules/Common/components/UserCard/UserCard.vue'
import { useTweetQuotesQuery, useTweetRepostsQuery } from '~/modules/tweets/queries/useTweetQueries'

const route = useRoute()

const tweetId = computed(() => route.params.tweetId as string)

const activeTab = ref<'quotes' | 'reposts'>('quotes')

// Use queries for fetching quotes and reposts
const {
    data: quotes,
    isLoading: isLoadingQuotes,
    error: quotesError,
    refetch: refetchQuotes,
} = useTweetQuotesQuery(tweetId)

const {
    data: reposts,
    isLoading: isLoadingReposts,
    error: repostsError,
    refetch: refetchReposts,
} = useTweetRepostsQuery(tweetId)
const quotesList = computed(() => quotes.value ?? [])
const repostsList = computed(() => reposts.value ?? [])
const isLoading = computed(() => isLoadingQuotes.value || isLoadingReposts.value)
const error = computed(() => quotesError.value || repostsError.value)
const quotesCount = computed(() => quotesList.value.length)
const repostsCount = computed(() => repostsList.value.length)

const refetch = async () => {
    // Refetch both queries using existing instances
    await Promise.all([refetchQuotes?.(), refetchReposts?.()])
}
</script>
