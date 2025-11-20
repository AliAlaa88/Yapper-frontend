<template>
    <div class="flex items-center justify-between max-w-[425px] mt-3">
        <!-- Reply -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-reply-button"
                    class="group flex cursor-pointer items-center gap-1 text-secondary hover:text-blue transition-colors"
                    @click.stop
                   
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <MessageCircle :size="18" />
                    </div>
                    <span class="text-xs min-w-5">{{ formatCount(replies) }}</span>
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
                    :class="[
                        'group flex cursor-pointer items-center gap-1 transition-colors',
                        localIsReposted ? 'text-green' : 'text-secondary hover:text-green'
                    ]"
                    @click.stop="handleRepostClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-green/10 transition-colors">
                        <Repeat2 :size="18" :fill="localIsReposted ? 'currentColor' : 'none'"  />
                    </div>
                    <span class="text-xs min-w-5">{{ formatCount(localRepostsCount) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ localIsReposted ? 'Undo Retweet' : 'Retweet' }}</div>
            </template>
        </CustomToolTip>

        <!-- Like -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-like-button"
                    :class="[
                        'group flex cursor-pointer items-center gap-1 transition-colors',
                        localIsLiked ? 'text-red' : 'text-secondary hover:text-red'
                    ]"
                    @click.stop="handleLikeClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-red/10 transition-colors relative">
                        <Heart 
                            :size="18" 
                            :fill="localIsLiked ? 'currentColor' : 'none'" 
                            :class="{ 'animate-like': isAnimating }"
                        />
                    </div>
                    <span class="text-xs min-w-5">{{ formatCount(localLikesCount) }}</span>
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
                    class="group flex cursor-pointer items-center gap-1 text-secondary hover:text-blue transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <BarChart3 :size="18" />
                    </div>
                    <span class="text-xs min-w-5">{{ formatCount(views || 0) }}</span>
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
                    class="group flex cursor-pointer items-center gap-1 text-secondary hover:text-blue transition-colors"
                    @click.stop
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
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
import { mutateTweetLikesQuery, mutateTweetRepostsQuery } from '../../../../queries/useTweetQueries'
import { useTweetTransitionStore } from '../../../../stores/tweetTransition'

const props = defineProps<{
    stats: StatsType
}>()

const { likes, replies, retweets, views, is_liked,tweet_id,is_reposted } = toRefs(props.stats)
const localIsLiked = ref(is_liked.value);
const localLikesCount = ref(likes.value);
const isAnimating = ref(false);
const localIsReposted = ref(is_reposted.value);
const localRepostsCount = ref(retweets.value);
const queryClient = useQueryClient()
const tweetTransitionStore = useTweetTransitionStore()
const { mutate: mutateLike, isPending } = mutateTweetLikesQuery(tweet_id.value, localIsLiked.value)
const { mutate: mutateRepost, isPending: isRepostPending } = mutateTweetRepostsQuery(tweet_id.value, localIsReposted.value)

const handleLikeClick = () => {
    // Logic to handle like/unlike action can be added here
    if(isPending.value) return; // Prevent multiple clicks while mutation is in progress

    const previousLikedState = localIsLiked.value;
    const previousLikesCount = localLikesCount.value;

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

    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_liked = localIsLiked.value
        tweetTransitionStore.transitionTweet.likes_count = localLikesCount.value
    }

    // Optimistically update all tweets queries (infinite queries)
    // Using setQueriesData to update all matching queries
    queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        // Create completely new objects to ensure Vue reactivity detects changes
        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
                const updatedData = page.data.map((tweet: any) => {
                    if (tweet.tweet_id === tweet_id.value) {
                        // Create a new object reference
                        return {
                            ...tweet,
                            is_liked: localIsLiked.value,
                            likes_count: localLikesCount.value
                        }
                    }
                    return tweet
                })
                
                return {
                    ...page,
                    data: updatedData
                }
            })
        }
    })

    //call mutation to update like status
    mutateLike(localIsLiked.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data and confirm the optimistic update
            queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweet_id.value] })
        },
        onError: (error) => {
            // Rollback on error
            console.error('Error liking/unliking tweet:', error)
            localIsLiked.value = previousLikedState
            localLikesCount.value = previousLikesCount
            
            // Rollback transition store as well
            if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
                tweetTransitionStore.transitionTweet.is_liked = previousLikedState
                tweetTransitionStore.transitionTweet.likes_count = previousLikesCount
            }

            // Rollback the cache update
            queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData
                
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                        const updatedData = page.data.map((tweet: any) => {
                            if (tweet.tweet_id === tweet_id.value) {
                                return {
                                    ...tweet,
                                    is_liked: previousLikedState,
                                    likes_count: previousLikesCount
                                }
                            }
                            return tweet
                        })
                        
                        return {
                            ...page,
                            data: updatedData
                        }
                    })
                }
            })
            
            // Optional: Show error toast/notification
            // showErrorToast('Failed to update like status')
        }
    })
}
const handleRepostClick = () => {
    // Logic to handle repost/unrepost action can be added here
    if(isRepostPending.value) return; // Prevent multiple clicks while mutation is in progress
    
    const previousRepostedState = localIsReposted.value;
    const previousRepostsCount = localRepostsCount.value;

    localIsReposted.value = !localIsReposted.value;
    if(localIsReposted.value){
        localRepostsCount.value += 1;
        
    }else{
        localRepostsCount.value -= 1;
    }
    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_reposted = localIsReposted.value
        tweetTransitionStore.transitionTweet.reposts_count = localRepostsCount.value
    }

    // Optimistically update all tweets queries (infinite queries)
    queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        // Create completely new objects to ensure Vue reactivity detects changes
        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
                const updatedData = page.data.map((tweet: any) => {
                    if (tweet.tweet_id === tweet_id.value) {
                        // Create a new object reference
                        return {
                            ...tweet,
                            is_reposted: localIsReposted.value,
                            reposts_count: localRepostsCount.value
                        }
                    }
                    return tweet
                })
                
                return {
                    ...page,
                    data: updatedData
                }
            })
        }
    })

    //call mutation to update repost status
    mutateRepost(localIsReposted.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data and confirm the optimistic update
            queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweet_id.value] })
        },
        onError: (error) => {
            // Rollback on error
            console.error('Error reposting/unreposting tweet:', error)
            localIsReposted.value = previousRepostedState
            localRepostsCount.value = previousRepostsCount
            
            // Rollback transition store as well
            if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
                tweetTransitionStore.transitionTweet.is_reposted = previousRepostedState
                tweetTransitionStore.transitionTweet.reposts_count = previousRepostsCount
            }

            // Rollback the cache update
            queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData
                
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                        const updatedData = page.data.map((tweet: any) => {
                            if (tweet.tweet_id === tweet_id.value) {
                                return {
                                    ...tweet,
                                    is_reposted: previousRepostedState,
                                    reposts_count: previousRepostsCount
                                }
                            }
                            return tweet
                        })
                        
                        return {
                            ...page,
                            data: updatedData
                        }
                    })
                }
            })
            
            // Optional: Show error toast/notification
            // showErrorToast('Failed to update repost status')
        }
    })

}   
watch(is_liked, (newVal) => {
    localIsLiked.value = newVal;
});
watch(likes, (newVal) => {
    localLikesCount.value = newVal;
});
watch(is_reposted, (newVal) => {
    localIsReposted.value = newVal;
});
watch(retweets, (newVal) => {
    localRepostsCount.value = newVal;
});
</script>
