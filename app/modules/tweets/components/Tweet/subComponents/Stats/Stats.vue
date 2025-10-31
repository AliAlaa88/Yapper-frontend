<template>
    <div class="flex items-center justify-between max-w-[425px] mt-3">
        <!-- Reply -->
        <div class="group/tooltip relative">
            <button
                id="reply"
                class="group flex cursor-pointer items-center gap-1 text-[var(--color-x-gray-dark)] hover:text-[var(--color-x-blue)] transition-colors"
                @click.stop
            >
                <div
                    class="p-2 rounded-full group-hover:bg-[var(--color-x-blue)]/10 transition-colors"
                >
                    <MessageCircle :size="18" />
                </div>
                <span class="text-[13px] min-w-[20px]">{{ formatCount(replies) }}</span>
            </button>
            <span
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-x-gray-dark)] text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
                Reply
            </span>
        </div>
        <!-- Retweet -->
        <div class="group/tooltip relative">
            <button
                id="retweet"
                class="group flex cursor-pointer items-center gap-1 text-[var(--color-x-gray-dark)] hover:text-[var(--color-x-green)] transition-colors"
                @click.stop
            >
                <div
                    class="p-2 rounded-full group-hover:bg-[var(--color-x-green)]/10 transition-colors"
                >
                    <Repeat2 :size="18" />
                </div>
                <span class="text-[13px] min-w-[20px]">{{ formatCount(retweets) }}</span>
            </button>
            <span
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-x-gray-dark)] text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
                Retweet
            </span>
        </div>

        <!-- Like -->
        <div class="group/tooltip relative">
            <button
                id="like"
                class="group flex cursor-pointer items-center gap-1 text-[var(--color-x-gray-dark)] hover:text-[var(--color-x-red)] transition-colors"
                @click.stop
            >
                <div
                    class="p-2 rounded-full group-hover:bg-[var(--color-x-red)]/10 transition-colors"
                >
                    <Heart :size="18" />
                </div>
                <span class="text-[13px] min-w-[20px]">{{ formatCount(likes) }}</span>
            </button>
            <span
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-x-gray-dark)] text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
                Like
            </span>
        </div>

        <!-- Views -->
        <div v-if="views" class="group/tooltip relative">
            <button
                id="views"
                class="group flex cursor-pointer items-center gap-1 text-[var(--color-x-gray-dark)] hover:text-[var(--color-x-blue)] transition-colors"
                @click.stop
            >
                <div
                    class="p-2 rounded-full group-hover:bg-[var(--color-x-blue)]/10 transition-colors"
                >
                    <BarChart3 :size="18" />
                </div>
                <span class="text-[13px] min-w-[20px]">{{ formatCount(views || 0) }}</span>
            </button>
            <span
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-x-gray-dark)] text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
                Views
            </span>
        </div>
        <!-- Share -->
        <div class="group/tooltip relative">
            <button
                id="share"
                class="group flex cursor-pointer items-center gap-1 text-[var(--color-x-gray-dark)] hover:text-[var(--color-x-blue)] transition-colors"
                @click.stop
            >
                <div
                    class="p-2 rounded-full group-hover:bg-[var(--color-x-blue)]/10 transition-colors"
                >
                    <Share :size="18" />
                </div>
            </button>
            <span
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-x-gray-dark)] text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
                Share
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Stats as StatsType } from '../../../../types'
import { formatCount } from '../../../../utils/lib'
import { toRefs } from 'vue'
import { MessageCircle, Repeat2, Heart, BarChart3, Share } from 'lucide-vue-next'

const props = defineProps<{
    stats: StatsType
}>()

const { likes, replies, retweets, views } = toRefs(props.stats)
</script>
