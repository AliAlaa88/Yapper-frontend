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
                    :class="[
                        'group flex cursor-pointer items-center gap-1 transition-colors',
                        localIsLiked ? 'text-x-red' : 'text-x-gray-dark hover:text-x-red'
                    ]"
                    @click.stop="handleLikeClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-x-red/10 transition-colors relative">
                        <Heart 
                            :size="18" 
                            :fill="localIsLiked ? 'currentColor' : 'none'" 
                            :class="{ 'animate-like': isAnimating }"
                        />
                    </div>
                    <span class="text-[13px] min-w-5">{{ formatCount(localLikesCount) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ localIsLiked ? 'Unlike' : 'Like' }}</div>
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
import { useQueryClient } from '@tanstack/vue-query'
import { mutateTweetLikesQuery } from '../../../../queries/useTweetQueries'

const props = defineProps<{
    stats: StatsType
}>()

const { likes, replies, retweets, views, is_liked,tweet_id } = toRefs(props.stats)
const localIsLiked = ref(is_liked.value);
const localLikesCount = ref(likes.value);
const isAnimating = ref(false);

const queryClient = useQueryClient()
const { mutate: mutateLike, isPending } = mutateTweetLikesQuery(tweet_id.value, localIsLiked.value)

const handleLikeClick = () => {
    // Logic to handle like/unlike action can be added here
    if(isPending.value) return; // Prevent multiple clicks while mutation is in progress

    localIsLiked.value = !localIsLiked.value;
    if (localIsLiked.value) {
        localLikesCount.value += 1;
        // Trigger animation
        isAnimating.value = true;
        setTimeout(() => {
            isAnimating.value = false;
        }, 600);
    } else {
        localLikesCount.value -= 1;
    }

    //call mutation to update like status
    mutateLike(localIsLiked.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweet_id.value] })
        },
        onError: (error) => {
            // Rollback on error
            console.error('Error liking/unliking tweet:', error)
            localIsLiked.value = localIsLiked.value ? false : true
            const previousLikesCount = localIsLiked.value ? localLikesCount.value + 1 : localLikesCount.value - 1
            localLikesCount.value = previousLikesCount
            
            // Optional: Show error toast/notification
            // showErrorToast('Failed to update like status')
        }
    })
}
watch(is_liked, (newVal) => {
    localIsLiked.value = newVal;
});
watch(likes, (newVal) => {
    localLikesCount.value = newVal;
});
</script>
