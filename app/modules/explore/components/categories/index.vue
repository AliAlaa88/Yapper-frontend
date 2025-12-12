<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8 min-h-[calc(100vh-60px)]">
            <LoadingSpinner size="xl" />
        </div>

        <!-- Error state -->
        <div
            v-else-if="isError"
            class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary"
        >
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <button @click="() => trendsQuery.refetch()" class="text-accent hover:underline">
                {{ t('explore.tryAgain') }}
            </button>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="!trends.length"
            class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary"
        >
            <p class="text-muted text-lg">{{ t('explore.noCategoriesFound') }}</p>
        </div>

        <!-- Trends list -->
        <TrendsList v-else :trends="trends" :show-rank="true" />
    </div>
</template>

<script setup lang="ts">
import { useGetTrendsQuery } from '../../queries/useGetExploreQuery'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import TrendsList from '../common/TrendsList.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
const props = defineProps<{
    category: string
}>()
const trendsQuery = useGetTrendsQuery(capitalizeFirst(props.category), true)
const isLoading = computed(() => trendsQuery.isLoading.value)
const isError = computed(() => trendsQuery.isError.value)
const trends = computed(() => trendsQuery.data.value || [])
const config = useRuntimeConfig()
if (config.public.env === 'development') console.log('categories', toRaw(trends.value))
</script>
