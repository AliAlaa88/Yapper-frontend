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
                    <span class="text-xs min-w-5">{{ formatCount(replies, locale) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ $t('tweets.actions.reply') }}</div>
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
                    <span class="text-xs min-w-5">{{ formatCount(localRepostsCount, locale) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ localIsReposted ? $t('tweets.actions.undoRetweet') : $t('tweets.actions.retweet') }}</div>
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
                    <span class="text-xs min-w-5">{{ formatCount(localLikesCount, locale) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ localIsLiked ? $t('tweets.actions.unlike') : $t('tweets.actions.like') }}</div>
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
                    <span class="text-xs min-w-5">{{ formatCount(views || 0, locale) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ $t('tweets.actions.views') }}</div>
            </template>
        </CustomToolTip>

        <!-- Bookmark -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-bookmark-button"
                    :class="[
                        'group flex cursor-pointer items-center gap-1 transition-colors',
                        localIsBookmarked ? 'text-blue' : 'text-secondary hover:text-blue'
                    ]"
                    @click.stop="handleBookmarkClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <Bookmark :size="18" :fill="localIsBookmarked ? 'currentColor' : 'none'" />
                    </div>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ localIsBookmarked ? $t('tweets.actions.removeBookmark') : $t('tweets.actions.bookmark') }}</div>
            </template>
        </CustomToolTip>

        <!-- Share -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-share-button"
                    class="group flex cursor-pointer items-center gap-1 text-secondary hover:text-blue transition-colors"
                    @click.stop="handleShareClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <Share :size="18" />
                    </div>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ shareTooltipText }}</div>
            </template>
        </CustomToolTip>
    </div>
</template>

<script setup lang="ts">
import type { Stats as StatsType } from '../../../../types'
import { formatCount } from '../../../../utils/lib'
import { toRefs } from 'vue'
import { MessageCircle, Repeat2, Heart, BarChart3, Share, Bookmark } from 'lucide-vue-next'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import { useQueryClient } from '@tanstack/vue-query'
import { mutateTweetLikesQuery, mutateTweetRepostsQuery, mutateTweetBookmarkQuery } from '../../../../queries/useTweetQueries'
import { useTweetTransitionStore } from '../../../../stores/tweetTransition'

const props = defineProps<{
    stats: StatsType
}>()

const { likes, replies, retweets, views, is_liked, tweet_id, is_reposted, is_bookmarked,username } = toRefs(props.stats)
const localIsLiked = ref(is_liked.value);
const localLikesCount = ref(likes.value);
const isAnimating = ref(false);
const localIsReposted = ref(is_reposted.value);
const localRepostsCount = ref(retweets.value);
const localIsBookmarked = ref(is_bookmarked.value);
const shareTooltipText = ref('');
const { t, locale } = useI18n()

// Initialize share tooltip text
onMounted(() => {
    shareTooltipText.value = t('tweets.actions.share')
})

const queryClient = useQueryClient()
const tweetTransitionStore = useTweetTransitionStore()
const { mutate: mutateLike, isPending } = mutateTweetLikesQuery(tweet_id.value, localIsLiked.value)
const { mutate: mutateRepost, isPending: isRepostPending } = mutateTweetRepostsQuery(tweet_id.value, localIsReposted.value)
const { mutate: mutateBookmark, isPending: isBookmarkPending } = mutateTweetBookmarkQuery(tweet_id.value, localIsBookmarked.value)

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

const handleBookmarkClick = () => {
    if(isBookmarkPending.value) return; // Prevent multiple clicks while mutation is in progress
    
    const previousBookmarkedState = localIsBookmarked.value;

    localIsBookmarked.value = !localIsBookmarked.value;

    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_bookmarked = localIsBookmarked.value
    }

    // Optimistically update all tweets queries (infinite queries)
    queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
                const updatedData = page.data.map((tweet: any) => {
                    if (tweet.tweet_id === tweet_id.value) {
                        return {
                            ...tweet,
                            is_bookmarked: localIsBookmarked.value
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

    //call mutation to update bookmark status
    mutateBookmark(localIsBookmarked.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data and confirm the optimistic update
            queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweet_id.value] })
        },
        onError: (error) => {
            // Rollback on error
            console.error('Error bookmarking/unbookmarking tweet:', error)
            localIsBookmarked.value = previousBookmarkedState
            
            // Rollback transition store as well
            if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
                tweetTransitionStore.transitionTweet.is_bookmarked = previousBookmarkedState
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
                                    is_bookmarked: previousBookmarkedState
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
        }
    })
}

const handleShareClick = async () => {
    try {
        // Construct the tweet URL
        const tweetUrl = `${window.location.origin}/${username.value}/status/${tweet_id.value}`
        // console.log('Share clicked', tweetUrl);
        
        // Try to use the Web Share API if available (mobile devices)
        if (navigator.share) {
            await navigator.share({
                title: 'Share Tweet',
                url: tweetUrl
            })
        } else {
            // Fallback to clipboard API
            await navigator.clipboard.writeText(tweetUrl)
            
            // Update tooltip to show feedback
            shareTooltipText.value = t('tweets.actions.linkCopied')
            setTimeout(() => {
                shareTooltipText.value = t('tweets.actions.share')
            }, 2000)
        }
    } catch (error) {
        // If user cancels share or permission denied, silently fail
        console.log('Share cancelled or failed:', error)
    }
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
watch(is_bookmarked, (newVal) => {
    localIsBookmarked.value = newVal;
});
</script>
