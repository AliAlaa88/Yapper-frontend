<template>
<div>
    <ul>
        <li
            v-for="(item, index) in list"
            :key="index"
            class="px-4 py-3 hover:bg-hover transition-colors"
        >
            <div class="flex items-center gap-3">
                <Search :size="20" class="text-primary/50 shrink-0" />
                <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('selectQuery', item.query)">
                    <div class="text-primary font-semibold text-[15px] truncate">{{ item.query }}</div>
                    <div v-if="item.isTrending" class="text-primary/50 text-[13px]">
                        {{ $t('search.trending') }}
                    </div>
                </div>
                <button
                    v-if="!item.isTrending"
                    type="button"
                    class="p-1 hover:bg-accent/10 rounded-full shrink-0 transition-colors"
                    @click.stop="$emit('removeQuery', index)"
                    :aria-label="$t('search.removeQuery') + ' ' + item.query"
                >
                    <X :size="16" class="text-accent" />
                </button>
            </div>
        </li>
    </ul>
</div>
</template>

<script lang="ts" setup>
import { Search, X } from 'lucide-vue-next'
import type { SearchQuery } from '~/modules/search/types'

defineProps<{
    list: SearchQuery[]
}>()

defineEmits<{
    removeQuery: [index: number]
    selectQuery: [query: string]
}>()
</script>
