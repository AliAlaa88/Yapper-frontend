<template>
    <div class="overflow-x-hidden">
        <div class="w-full">
            <!-- Header with back button and title -->
            <div class="sticky top-0 bg-primary/95 backdrop-blur-sm z-10 border-b border-primary">
                <div class="flex items-center gap-8 px-4 py-3">
                    <button @click="router.back()" class="hover:bg-hover rounded-full p-2 transition-colors">
                        <ArrowLeft class="w-5 h-5 text-primary" />
                    </button>
                    <h1 class="text-xl font-bold text-primary">Connect</h1>
                </div>
                
                <!-- Tabs -->
                <div class="border-b border-primary bg-primary">
                    <ul class="flex w-full">
                        <li class="flex-1 text-center cursor-pointer transition-all duration-200 hover:bg-hover">
                            <button class="relative w-full px-4 py-4 text-base font-medium transition-colors duration-200 whitespace-nowrap text-primary">
                                {{ t('timeline.banner.whoToFollow') }}
                                <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-accent rounded-full" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Subtitle -->
            <div class="px-4 py-3 border-b border-primary">
                <h2 class="text-xl font-bold text-primary">Suggested for you</h2>
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
                        @click="whoToFollowQuery.refetch()" 
                        class="mt-2 text-accent hover:underline"
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
import { ArrowLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const whoToFollowQuery = useGetWhoToFollowQuery(true)
const isLoading = computed(() => whoToFollowQuery.isLoading.value)
const isError = computed(() => whoToFollowQuery.isError.value)
const users = computed(() => whoToFollowQuery.data.value?.data || [])
</script>
