<template>
    <div class="w-full">
        <div 
            v-for="(trend, index) in trends" 
            :key="trend.reference_id || index"
            class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer"
        >
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-muted text-sm">
                        <template v-if="showRank">{{ index + 1 }} · </template>
                        <template v-if="trend.category && trend.category !== 'none'">{{ capitalizeFirst(trend.category) }} · </template>
                        {{ t('explore.trending') }}
                    </p>
                    <p class="text-primary font-bold mt-1">{{ trend.text }}</p>
                    <p class="text-muted text-sm mt-1">
                        {{ formatCount(trend.posts_count) }} {{ t('explore.posts') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MoreHorizontal } from 'lucide-vue-next';

const { t } = useI18n();

interface Trend {
    text: string;
    posts_count: number;
    reference_id?: string;
    category?: string;
}

defineProps<{
    trends: Trend[];
    showRank?: boolean;
}>();

const formatCount = (count: number) => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count?.toString() || '0';
};

const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>
