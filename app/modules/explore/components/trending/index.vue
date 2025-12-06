<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8">
            <LoadingSpinner size="xl" />
        </div>

        <!-- Error state -->
        <div v-else-if="isError" class="px-4 py-8 text-center">
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <button 
                @click="() => refetch()" 
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
        <TrendsList v-else :trends="trends" :show-rank="true" />
    </div>
</template>

<script setup lang="ts">
import { useGetTrendsQuery } from '../../queries/useGetExploreQuery';
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue';
import TrendsList from '../common/TrendsList.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const trends = ref<any[]>([]);
const category = ref('');

const { isLoading, isError, refetch } = useGetTrendsQuery(
    category.value,
    true,
    (response: any) => {
        trends.value = response.data || response;
    },
    (error: any) => {
        console.error('Error fetching trends:', error);
    }
);
</script>