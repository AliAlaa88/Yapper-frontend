<template>
    <div class="flex items-center justify-between max-w-[425px] mt-3">
        <!-- Reply -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-reply-button"
                    class="group flex cursor-pointer items-center gap-1 text-x-gray-dark hover:text-x-blue transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-x-blue/10 transition-colors">
                        <MessageCircle :size="18" />
                    </div>
                    <span class="text-[13px] min-w-5">{{ formatCount(replies) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">Reply</div>
            </template>
        </CustomToolTip>

        <!-- Retweet -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-retweet-button"
                    class="group flex cursor-pointer items-center text-x-gray-dark hover:text-x-green transition-colors"
                    @click.stop
                >
                    <div class="p-1 rounded-full group-hover:bg-x-green/10 transition-colors">
                        <Repeat2 :size="18" />
                    </div>
                    <span class="text-[13px] min-w-5">{{ formatCount(retweets) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">Retweet</div>
            </template>
        </CustomToolTip>

        <!-- Like -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-like-button"
                    class="group flex cursor-pointer items-center gap-1 text-x-gray-dark hover:text-x-red transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-x-red/10 transition-colors">
                        <Heart :size="18" />
                    </div>
                    <span class="text-[13px] min-w-5">{{ formatCount(likes) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">Like</div>
            </template>
        </CustomToolTip>

        <!-- Views -->
        <CustomToolTip v-if="views" side="bottom" align="start">
            <template #trigger>
                <button
                    id="tweet-views-button"
                    class="group flex cursor-pointer items-center gap-1 text-x-gray-dark hover:text-x-blue transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-x-blue/10 transition-colors">
                        <BarChart3 :size="18" />
                    </div>
                    <span class="text-[13px] min-w-5">{{ formatCount(views || 0) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">Views</div>
            </template>
        </CustomToolTip>

        <!-- Share -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-share-button"
                    class="group flex cursor-pointer items-center gap-1 text-x-gray-dark hover:text-x-blue transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-x-blue/10 transition-colors">
                        <Share :size="18" />
                    </div>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">Share</div>
            </template>
        </CustomToolTip>
    </div>
</template>

<script setup lang="ts">
import type { Stats as StatsType } from '../../../../types'
import { formatCount } from '../../../../utils/lib'
import { toRefs } from 'vue'
import { MessageCircle, Repeat2, Heart, BarChart3, Share } from 'lucide-vue-next'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'

const props = defineProps<{
    stats: StatsType
}>()

const { likes, replies, retweets, views } = toRefs(props.stats)
</script>
