<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8 min-h-[calc(100vh-60px)]">
            <LoadingSpinner size="xl" />
        </div>

        <!-- Error state -->
        <div v-else-if="isError" class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary">
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <button 
                @click="() => refetch()" 
                class="text-accent hover:underline"
            >
                {{ t('explore.tryAgain') }}
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!trends?.length" class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary">
            <p class="text-muted text-lg">{{ t('explore.noTrends') }}</p>
        </div>

        <!-- Trends list -->
        <TrendsList v-else :trends="trends" :show-rank="true" />
    </div>
</template>

<script setup lang="ts">
import { useGetExploreCategoriesQuery } from '../../queries/useGetExploreQuery';
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue';
import TrendsList from '../common/TrendsList.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const trends = ref<any[]>([]);
const props = defineProps<{
    category: string;
}>();
const { isLoading, isError, refetch } = useGetExploreCategoriesQuery(
    props.category,
    true,
    (response: any) => {
        trends.value = response.data || response;
    },
    (error: any) => {
        console.error('Error fetching trends:', error);
    }
);
</script>