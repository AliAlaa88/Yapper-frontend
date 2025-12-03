<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="isError" class="px-4 py-8 text-center">
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <button 
                @click="refetch" 
                class="mt-2 text-accent hover:underline"
            >
                {{ t('explore.tryAgain') }}
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!trends?.length" class="px-4 py-8 text-center">
            <p class="text-muted">{{ t('explore.noTrends') }}</p>
        </div>

        <!-- Trends list -->
        <div v-else>
            <div 
                v-for="(trend, index) in trends" 
                :key="index"
                class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer border-b border-primary"
            >
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="text-muted text-sm">
                            {{ index + 1 }} · {{ t('explore.trending') }}
                        </p>
                        <p class="text-primary font-bold mt-1">{{ trend.text }}</p>
                        <p class="text-muted text-sm mt-1">
                            {{ formatCount(trend.posts_count) }} {{ t('explore.posts') }}
                        </p>
                    </div>
                    <button 
                        class="p-2 hover:bg-accent/10 rounded-full transition-colors"
                        @click.stop
                    >
                        <MoreHorizontal class="w-5 h-5 text-muted" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGetTrendsQuery } from '../../queries/useGetExploreQuery';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MoreHorizontal } from 'lucide-vue-next';

const { t } = useI18n();

const trends = ref<any[]>([]);
const category = ref('');
const country = ref('eg');

const { isLoading, isError, refetch } = useGetTrendsQuery(
    category.value,
    country.value,
    true,
    (response: any) => {
        trends.value = response.data || response;
    },
    (error: any) => {
        console.error('Error fetching trends:', error);
    }
);

const formatCount = (count: number) => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count?.toString() || '0';
};
</script>