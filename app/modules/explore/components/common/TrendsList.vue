<template>
    <div class="w-full">
        <div
            v-for="(trend, index) in trends"
            :key="trend.reference_id || index"
            class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer group"
        >
            <div class="flex flex-col gap-0.5" id="link-trend-item" @click="onClickTrend(trend)">
                <div class="flex items-center gap-1 text-muted text-xs">
                    <template v-if="showRank">
                        <span class="font-medium">{{ index + 1 }}</span>
                        <span class="text-muted/60">·</span>
                    </template>
                    <template v-if="trend.category && trend.category !== 'none'">
                        <span class="capitalize">{{ trend.category }}</span>
                        <span class="text-muted/60">·</span>
                    </template>
                    <span>{{ t('explore.trending') }}</span>
                </div>

                <p
                    class="text-primary font-bold text-[15px] leading-5 mt-0.5 group-hover:underline"
                >
                    {{ trend.text }}
                </p>

                <p class="text-muted text-xs mt-1">
                    {{ formatCount(trend.posts_count) }} {{ t('explore.posts') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
interface Trend {
    text: string
    posts_count: number
    reference_id?: string
    category?: string
}

defineProps<{
    trends: Trend[]
    showRank?: boolean
}>()

const formatCount = (count: number) => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'
    }
    return count?.toString() || '0'
}

function onClickTrend(trend: Trend) {
    const text = trend.text.toLowerCase()
    router.push(`/search?q=${encodeURIComponent(text)}&src=trend_click`)
}
</script>
