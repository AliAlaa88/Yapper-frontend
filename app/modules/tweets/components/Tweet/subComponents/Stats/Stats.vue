<template>
    <div class="flex items-center justify-between mt-3">
        <!-- Reply -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-reply-button"
                    class="group flex cursor-pointer items-center gap-1 text-secondary hover:text-blue transition-colors"
                    @click.stop="handleReplyClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <MessageCircle :size="18" />
                    </div>
                    <span class="text-xs min-w-5">{{ formatCount(localRepliesCount, locale) }}</span>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">{{ $t('tweets.actions.reply') }}</div>
            </template>
        </CustomToolTip>

        <!-- Retweet with dropdown -->
        <div ref="repostContainerRef" class="relative">
            <div class="group flex items-center">
                <button
                    id="tweet-retweet-button"
                    :class="[
                        'flex cursor-pointer items-center gap-1 transition-colors',
                        localIsReposted ? 'text-green' : 'text-secondary hover:text-green',
                    ]"
                    @click.stop="toggleRepostMenu"
                >
                    <div class="p-2 rounded-full group-hover:bg-green/10 transition-colors">
                        <Repeat2 :size="18" :fill="localIsReposted ? 'currentColor' : 'none'" />
                    </div>
                </button>
                <CustomToolTip side="bottom" align="start" :delay-duration="300">
                    <template #trigger>
                        <button
                            class="text-xs min-w-5 text-secondary cursor-pointer hover:text-green transition-colors"
                            @click.stop="handleViewQuotesAndReposts"
                        >
                            {{ formatCount(localRepostsCount, locale) }}
                        </button>
                    </template>
                    <template #content>
                        <div :class="contentClass">{{ $t('tweets.actions.viewQuotes') }}</div>
                    </template>
                </CustomToolTip>
            </div>

            <!-- Repost Dropdown Menu -->
            <div
                v-if="showRepostMenu"
                class="absolute bottom-full left-0 mb-2 bg-primary border border-primary rounded-xl shadow-lg py-2 min-w-40 z-50"
            >
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-primary"
                    @click.stop="handleRepostAction"
                >
                    <Repeat2 :size="18" />
                    <span class="font-semibold">{{ localIsReposted ? $t('tweets.actions.undoRetweet') : $t('tweets.actions.retweet') }}</span>
                </button>
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-primary"
                    @click.stop="handleQuoteClick"
                >
                    <Quote :size="18" />
                    <span class="font-semibold">{{ $t('tweets.actions.quote') }}</span>
                </button>
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-primary border-t border-primary"
                    @click.stop="handleViewQuotesAndRepostsFromMenu"
                >
                    <BarChart3 :size="18" />
                    <span class="font-semibold">{{ $t('tweets.actions.viewQuotes') }}</span>
                </button>
            </div>
        </div>

        <!-- Like -->
        <CustomToolTip side="bottom" align="start" :delay-duration="300">
            <template #trigger>
                <button
                    id="tweet-like-button"
                    :class="[
                        'group flex cursor-pointer items-center gap-1 transition-colors',
                        localIsLiked ? 'text-red' : 'text-secondary hover:text-red',
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
                <div :class="contentClass">
                    {{ localIsLiked ? $t('tweets.actions.unlike') : $t('tweets.actions.like') }}
                </div>
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
                        localIsBookmarked ? 'text-blue' : 'text-secondary hover:text-blue',
                    ]"
                    @click.stop="handleBookmarkClick"
                >
                    <div class="p-2 rounded-full group-hover:bg-blue/10 transition-colors">
                        <Bookmark :size="18" :fill="localIsBookmarked ? 'currentColor' : 'none'" />
                    </div>
                </button>
            </template>
            <template #content>
                <div :class="contentClass">
                    {{
                        localIsBookmarked
                            ? $t('tweets.actions.removeBookmark')
                            : $t('tweets.actions.bookmark')
                    }}
                </div>
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
import { toRefs, ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { MessageCircle, Repeat2, Heart, BarChart3, Share, Bookmark, Quote } from 'lucide-vue-next'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import {
    mutateTweetLikesQuery,
    mutateTweetRepostsQuery,
    mutateTweetBookmarkQuery,
} from '../../../../queries/useTweetQueries'
import { useTweetTransitionStore } from '../../../../stores/tweetTransition'
import {useUserStore} from '~/modules/auth/stores/userStore'
const userStore = useUserStore()
const user_id = computed(() => userStore.getUser()?.user_id)
const {$queryClient} = useNuxtApp()

const props = defineProps<{
    stats: StatsType
}>()

const emit = defineEmits<{
    (e: 'quote'): void
    (e: 'reply'): void
    (e: 'viewQuotesAndReposts'): void
}>()

const likes = computed(() => props.stats.likes)
const replies = computed(() => props.stats.replies)
const retweets = computed(() => props.stats.retweets)
const views = computed(() => props.stats.views)
const is_liked = computed(() => props.stats.is_liked)
const tweet_id = computed(() => props.stats.tweet_id)
const is_reposted = computed(() => props.stats.is_reposted)
const is_bookmarked = computed(() => props.stats.is_bookmarked)
const username = computed(() => props.stats.username)

const localIsLiked = ref(is_liked.value)
const localLikesCount = ref(likes.value)
const isAnimating = ref(false)
const localIsReposted = ref(is_reposted.value)
const localRepostsCount = ref(retweets.value)
const localIsBookmarked = ref(is_bookmarked.value)
const shareTooltipText = ref('')
const localRepliesCount = ref(replies.value)
const showRepostMenu = ref(false)
const repostContainerRef = ref<HTMLElement | null>(null)
const { t, locale } = useI18n()

// Inject the global snackbar from layout
const snackbar = inject<{
    handleShowSnackbar: (
        message: string,
        username?: string,
        action?: string,
        handleClick?: () => void,
    ) => void
}>('snackbar')

// Initialize share tooltip text
onMounted(() => {
    shareTooltipText.value = t('tweets.actions.share')
    document.addEventListener('click', handleClickOutsideRepostMenu)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutsideRepostMenu)
})

const handleClickOutsideRepostMenu = (event: MouseEvent) => {
    if (repostContainerRef.value && !repostContainerRef.value.contains(event.target as Node)) {
        showRepostMenu.value = false
    }
}


const tweetTransitionStore = useTweetTransitionStore()
const { mutate: mutateLike, isPending } = mutateTweetLikesQuery(tweet_id.value, localIsLiked.value)
const { mutate: mutateRepost, isPending: isRepostPending } = mutateTweetRepostsQuery(
    tweet_id.value,
    localIsReposted.value,
    `/users/${user_id.value}/posts`,
)
const { mutate: mutateBookmark, isPending: isBookmarkPending } = mutateTweetBookmarkQuery(
    tweet_id.value,
    localIsBookmarked.value,
)

const handleLikeClick = () => {
    // Logic to handle like/unlike action can be added here
    if (isPending.value) return // Prevent multiple clicks while mutation is in progress

    const previousLikedState = localIsLiked.value
    const previousLikesCount = localLikesCount.value

    localIsLiked.value = !localIsLiked.value
    if (localIsLiked.value) {
        localLikesCount.value += 1
        // Trigger animation
        isAnimating.value = true
        setTimeout(() => {
            isAnimating.value = false
        }, 600)
    } else {
        localLikesCount.value -= 1
    }

    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_liked = localIsLiked.value
        tweetTransitionStore.transitionTweet.likes_count = localLikesCount.value
    }

    // Optimistically update all tweets queries (infinite queries)
    // Using setQueriesData to update all matching queries
    $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
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
                            likes_count: localLikesCount.value,
                        }
                    }
                    return tweet
                })

                return {
                    ...page,
                    data: updatedData,
                }
            }),
        }
    })

    //call mutation to update like status
    mutateLike(localIsLiked.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data and confirm the optimistic update
            console.log('Like mutation succeeded for tweet:', $queryClient, tweet_id.value)
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
            $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                        const updatedData = page.data.map((tweet: any) => {
                            if (tweet.tweet_id === tweet_id.value) {
                                return {
                                    ...tweet,
                                    is_liked: previousLikedState,
                                    likes_count: previousLikesCount,
                                }
                            }
                            return tweet
                        })

                        return {
                            ...page,
                            data: updatedData,
                        }
                    }),
                }
            })
        },
    })
}

const toggleRepostMenu = () => {
    showRepostMenu.value = !showRepostMenu.value
}

const closeRepostMenu = () => {
    showRepostMenu.value = false
}

const handleQuoteClick = () => {
    showRepostMenu.value = false
    emit('quote')
}

const handleReplyClick = () => {
    emit('reply')
}

const handleViewQuotesAndReposts = () => {
    showRepostMenu.value = false
    emit('viewQuotesAndReposts')
}

const handleViewQuotesAndRepostsFromMenu = () => {
    showRepostMenu.value = false
    emit('viewQuotesAndReposts')
}

const handleRepostAction = () => {
    showRepostMenu.value = false
    // Logic to handle repost/unrepost action can be added here
    if (isRepostPending.value) return // Prevent multiple clicks while mutation is in progress

    const previousRepostedState = localIsReposted.value
    const previousRepostsCount = localRepostsCount.value

    localIsReposted.value = !localIsReposted.value
    if (localIsReposted.value) {
        localRepostsCount.value += 1
    } else {
        localRepostsCount.value -= 1
    }
    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_reposted = localIsReposted.value
        tweetTransitionStore.transitionTweet.reposts_count = localRepostsCount.value
    }

    // Optimistically update all tweets queries (infinite queries)
    $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
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
                            reposts_count: localRepostsCount.value,
                        }
                    }
                    return tweet
                })

                return {
                    ...page,
                    data: updatedData,
                }
            }),
        }
    })

    //call mutation to update repost status
    mutateRepost(localIsReposted.value, tweet_id.value, `/users/${user_id.value}/posts`)
}

const handleBookmarkClick = () => {
    if (isBookmarkPending.value) return // Prevent multiple clicks while mutation is in progress

    const previousBookmarkedState = localIsBookmarked.value

    localIsBookmarked.value = !localIsBookmarked.value

    // Update the transition store if this tweet is stored there
    if (tweetTransitionStore.transitionTweet?.tweet_id === tweet_id.value) {
        tweetTransitionStore.transitionTweet.is_bookmarked = localIsBookmarked.value
    }

    // Optimistically update all tweets queries (infinite queries)
    $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData

        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
                const updatedData = page.data.map((tweet: any) => {
                    if (tweet.tweet_id === tweet_id.value) {
                        return {
                            ...tweet,
                            is_bookmarked: localIsBookmarked.value,
                        }
                    }
                    return tweet
                })

                return {
                    ...page,
                    data: updatedData,
                }
            }),
        }
    })

    //call mutation to update bookmark status
    mutateBookmark(localIsBookmarked.value, {
        onSuccess: () => {
            // Invalidate relevant queries to refetch data and confirm the optimistic update
           $queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweet_id.value] })

            snackbar?.handleShowSnackbar(
                localIsBookmarked.value
                    ? t('tweets.actions.bookmarkAdded')
                    : t('tweets.actions.bookmarkRemoved'),
            )
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
            $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                        const updatedData = page.data.map((tweet: any) => {
                            if (tweet.tweet_id === tweet_id.value) {
                                return {
                                    ...tweet,
                                    is_bookmarked: previousBookmarkedState,
                                }
                            }
                            return tweet
                        })

                        return {
                            ...page,
                            data: updatedData,
                        }
                    }),
                }
            })
        },
    })
}

const handleShareClick = async () => {
    try {
        // Construct the tweet URL
        const tweetUrl = `${window.location.origin}/${username.value}/status/${tweet_id.value}`

        // Try to use the Web Share API if available (mobile devices)
        if (navigator.share) {
            await navigator.share({
                title: 'Share Tweet',
                url: tweetUrl,
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

        // Show snackbar for successful copy/share
        snackbar?.handleShowSnackbar(t('tweets.actions.copiedToClipboard'))
    } catch (error) {
        // If user cancels share or permission denied, silently fail
        console.log('Share cancelled or failed:', error)
    }
}

watch(is_liked, (newVal) => {
    localIsLiked.value = newVal
})
watch(likes, (newVal) => {
    localLikesCount.value = newVal
})
watch(is_reposted, (newVal) => {
    localIsReposted.value = newVal
})
watch(retweets, (newVal) => {
    localRepostsCount.value = newVal
})
watch(is_bookmarked, (newVal) => {
    localIsBookmarked.value = newVal
})
watch(replies, (newVal) => {
    localRepliesCount.value = newVal
})

// Watch the entire stats prop for deep changes (when parent object is replaced)
watch(
    () => props.stats,
    (newStats) => {
        localIsLiked.value = newStats.is_liked
        localLikesCount.value = newStats.likes
        localIsReposted.value = newStats.is_reposted
        localRepostsCount.value = newStats.retweets
        localIsBookmarked.value = newStats.is_bookmarked
        localRepliesCount.value = newStats.replies
    },
    { deep: true }
)
</script>
