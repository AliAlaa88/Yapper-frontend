<template>
    <div class="overflow-x-hidden">
        <div class="w-full">
            <!-- Header with back button and title -->
            <div class="sticky top-0 bg-primary/95 backdrop-blur-sm z-10 border-b border-primary">
                <div class="flex items-center gap-8 px-4 py-3 rtl:flex-row-reverse">
                    <button id="btn-back-who-to-follow" @click="router.back()" class="hover:bg-hover rounded-full p-2 transition-colors cursor-pointer">
                        <ArrowLeft class="w-5 h-5 text-primary rtl:rotate-180" />
                    </button>
                    <h1 class="text-xl font-bold text-primary">{{ t('explore.connect') }}</h1>
                </div>

                <!-- Tabs -->
                <Tabs
                    :tabs="[{ label: t('timeline.banner.whoToFollow'), value: 'who-to-follow' }]"
                    active-tab="who-to-follow"
                    :on-change="() => {}"
                />
            </div>

            <!-- Subtitle -->
            <div class="px-4 py-3 border-b border-primary">
                <h2 class="text-xl font-bold text-primary">{{ t('explore.suggestedForYou') }}</h2>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center py-8 min-h-[calc(100vh-120px)]">
                <LoadingSpinner size="xl" />
            </div>

            <!-- Error state -->
            <div v-else-if="isError" class="flex items-center justify-center min-h-[calc(100vh-120px)]">
                <div class="text-center">
                    <p class="text-muted">{{ t('explore.errorLoading') }}</p>
                    <button
                        id="btn-retry-who-to-follow"
                        @click="whoToFollowQuery.refetch()"
                        class="mt-2 text-accent hover:underline cursor-pointer"
                    >
                        {{ t('explore.tryAgain') }}
                    </button>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else-if="!users?.length" class="flex items-center justify-center min-h-[calc(100vh-120px)]">
                <p class="text-muted text-lg">{{ t('explore.noUsersFound') }}</p>
            </div>

            <!-- Users list -->
            <WhoToFollowList v-else :users="users" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGetWhoToFollowQuery } from '~/modules/explore/queries/useGetExploreQuery'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import WhoToFollowList from '~/modules/explore/components/common/WhoToFollowList.vue'
import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const whoToFollowQuery = useGetWhoToFollowQuery(true)
const isLoading = computed(() => whoToFollowQuery.isLoading.value)
const isError = computed(() => whoToFollowQuery.isError.value)
const users = computed(() => whoToFollowQuery.data.value?.data || [])
</script>
