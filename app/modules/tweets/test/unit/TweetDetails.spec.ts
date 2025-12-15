import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TweetDetails from '../../components/TweetDetails/TweetDetails.vue'
import type { TweetDetails as tweetDetails } from '../../types'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useNuxtApp: vi.fn(() => ({
        $queryClient: {},
        $tweetService: {},
        $userInfoService: {},
    })),
    useRoute: vi.fn(() => ({
        params: {
            username: 'alice',
            tweetId: 't1',
        },
        path: '/',
    })),
    useRouter: vi.fn(() => ({
        back: vi.fn(),
    })),
}))

vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        t: (key: string) => key,
        locale: 'en',
    })),
}))

// Mock navigation utilities
vi.mock('../../utils/navigation', () => ({
    getProfileUrl: vi.fn((user) => user.link || `/profile/${user.username}` || '#'),
    getTweetUrl: vi.fn((tweet) => `/${tweet.user.username}/status/${tweet.id}`),
}))

// Mock formatDetailDate utility
vi.mock('../../utils/lib', () => ({
    formatDate: vi.fn((date) => '2h'),
    formatCount: vi.fn((count) => {
        if (count === 0) return ''
        if (count < 1000) return count.toString()
        if (count < 10000) return `${(count / 1000).toFixed(1)}K`
        if (count < 1000000) return `${Math.floor(count / 1000)}K`
        return `${(count / 1000000).toFixed(1)}M`
    }),
    formatDetailDate: vi.fn((date) => '7:54 PM · Oct 17, 2025'),
}))

// Mock useTweetDetails composable
vi.mock('../../composables/useTweetDetails', () => ({
    useTweetDetails: vi.fn(),
}))

// Mock useSnackbar and useConfirmation composables
vi.mock('~/modules/profile/composables/useSnackbar', () => ({
    useSnackbar: vi.fn(() => ({
        showSnackbar: vi.fn(),
        handleShowSnackbar: vi.fn(),
    })),
}))

vi.mock('~/modules/profile/composables/useConfirmation', () => ({
    useConfirmation: vi.fn(() => ({
        showConfirmation: vi.fn(),
        handleShowConfirmation: vi.fn(),
    })),
}))

// Mock tweet mutations
vi.mock('../../queries/useTweetQueries', () => ({
    useDeleteTweetMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: { value: false },
    })),
    useUpdateTweetMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: { value: false },
    })),
    useTweetSummaryQuery: vi.fn(() => ({
        data: { value: null },
        isLoading: { value: false },
        error: { value: null },
        refetch: vi.fn(),
    })),
}))

describe('TweetDetails Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Loading State', () => {
        it('displays loading spinner when isLoading is true', async () => {
            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref(null),
                isLoading: ref(true),
                error: ref(null),
                replies: ref([]),
                fetchTweetDetails: vi.fn(),
            } as any)

            const wrapper = mount(TweetDetails, {
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                        ReplyForm: { template: '<div></div>' },
                        Reply: { template: '<div></div>' },
                        QuoteModal: { template: '<div></div>' },
                        ProfileActionsMenu: { template: '<div></div>' },
                    },
                    provide: {
                        snackbar: {
                            showSnackbar: vi.fn(),
                            handleShowSnackbar: vi.fn(),
                        },
                        confirmation: {
                            showConfirmation: vi.fn(),
                            handleShowConfirmation: vi.fn(),
                        },
                    },
                    mocks: {
                        $router: {
                            back: vi.fn(),
                        },
                        $t: (msg) => {
                            if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                            if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                            return msg
                        },
                    },
                    config: {
                        globalProperties: {
                            $t: (msg) => {
                                if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                                if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                                return msg
                            },
                        },
                    },
                },
            })

            wrapper.vm.t = (msg) => {
                if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                return msg
            }
            await wrapper.vm.$forceUpdate?.()
            expect(wrapper.find('.animate-spin').exists()).toBe(true)
            expect(wrapper.text()).toContain('Loading')
        })

        describe('Error State', () => {
            it('displays error message when error exists', async () => {
                const { useTweetDetails } = await import('../../composables/useTweetDetails')
                vi.mocked(useTweetDetails).mockReturnValue({
                    tweetDetails: ref(null),
                    isLoading: ref(false),
                    error: ref(new Error('Failed to load tweet')),
                    replies: ref([]),
                    fetchTweetDetails: vi.fn(),
                } as any)

                const wrapper = mount(TweetDetails, {
                    global: {
                        stubs: {
                            NuxtLink: true,
                            Publisher: true,
                            Content: true,
                            Stats: true,
                        },
                        provide: {
                            snackbar: {
                                showSnackbar: vi.fn(),
                                handleShowSnackbar: vi.fn(),
                            },
                            confirmation: {
                                showConfirmation: vi.fn(),
                                handleShowConfirmation: vi.fn(),
                            },
                        },
                        mocks: {
                            $router: {
                                back: vi.fn(),
                            },
                            t: (msg) => {
                                if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                                if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                                return msg
                            },
                        },
                        config: {
                            globalProperties: {
                                $t: (msg) => {
                                    if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                                    if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                                    return msg
                                },
                            },
                        },
                    },
                })

                wrapper.vm.t = (msg) => {
                    if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                    if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                    return msg
                }
                await wrapper.vm.$forceUpdate?.()
                expect(wrapper.text()).toContain('Failed to load tweet')
            })

            it('calls fetchTweetDetails when retry button is clicked', async () => {
                const fetchTweetDetailsMock = vi.fn()
                const { useTweetDetails } = await import('../../composables/useTweetDetails')
                vi.mocked(useTweetDetails).mockReturnValue({
                    tweetDetails: ref(null),
                    isLoading: ref(false),
                    error: ref(new Error('Failed to load tweet')),
                    replies: ref([]),
                    fetchTweetDetails: fetchTweetDetailsMock,
                } as any)

                const wrapper = mount(TweetDetails, {
                    global: {
                        stubs: {
                            NuxtLink: true,
                            Publisher: true,
                            Content: true,
                            Stats: true,
                        },
                        provide: {
                            snackbar: {
                                showSnackbar: vi.fn(),
                                handleShowSnackbar: vi.fn(),
                            },
                            confirmation: {
                                showConfirmation: vi.fn(),
                                handleShowConfirmation: vi.fn(),
                            },
                        },
                        mocks: {
                            $router: {
                                back: vi.fn(),
                            },
                            $t: (msg) => {
                                if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                                if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                                return msg
                            },
                        },
                        config: {
                            globalProperties: {
                                $t: (msg) => {
                                    if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                                    if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                                    return msg
                                },
                            },
                        },
                    },
                })

                wrapper.vm.t = (msg) => {
                    if (msg === 'tweets.loading.tweetDetails') return 'Loading'
                    if (msg === 'tweets.errors.tryAgain') return 'Try Again'
                    return msg
                }
                await wrapper.vm.$forceUpdate?.()
                await wrapper.find('#tweet-detail-retry-button').trigger('click')
                expect(fetchTweetDetailsMock).toHaveBeenCalled()
            })
        })
    })

    describe('Success State', () => {
        const mockTweetDetails = {
            tweet_id: 't1',
            content: 'Test tweet content',
            user: {
                id: 'u1',
                name: 'Alice',
                username: 'alice',
                avatar_url: '/avatar.jpg',
                verified: false,
            },
            likes_count: 10,
            replies_count: 5,
            reposts_count: 3,
            views_count: 100,
            is_liked: false,
            is_reposted: false,
            is_bookmarked: false,
            created_at: '2025-10-17T19:54:00.000Z',
            images: [],
            videos: [],
            gifs: [],
        }

        it('renders tweet content when data is loaded', async () => {
            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref(mockTweetDetails),
                isLoading: ref(false),
                error: ref(null),
                replies: ref([]),
                fetchTweetDetails: vi.fn(),
            } as any)

            const wrapper = mount(TweetDetails, {
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: {
                            template: '<div class="publisher-stub">{{ publisher?.name }}</div>',
                            props: ['publisher'],
                        },
                        Content: {
                            template: '<div class="content-stub">{{ content?.text }}</div>',
                            props: ['content'],
                        },
                        Stats: true,
                        ReplyForm: { template: '<div class="reply-form-stub"></div>' },
                        Reply: { template: '<div class="reply-stub"></div>' },
                        QuoteModal: { template: '<div></div>' },
                        ProfileActionsMenu: { template: '<div></div>' },
                        MyTweetActionsMenu: { template: '<div></div>' },
                    },
                    provide: {
                        snackbar: { showSnackbar: vi.fn(), handleShowSnackbar: vi.fn() },
                        confirmation: {
                            showConfirmation: vi.fn(),
                            handleShowConfirmation: vi.fn(),
                        },
                    },
                    mocks: { $router: { back: vi.fn() }, $t: (msg: string) => msg },
                },
            })

            expect(wrapper.find('.publisher-stub').exists()).toBe(true)
            expect(wrapper.find('.content-stub').exists()).toBe(true)
        })

        it('renders reply form in success state', async () => {
            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref(mockTweetDetails),
                isLoading: ref(false),
                error: ref(null),
                replies: ref([]),
                fetchTweetDetails: vi.fn(),
            } as any)

            const wrapper = mount(TweetDetails, {
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                        ReplyForm: { template: '<div class="reply-form-stub"></div>' },
                        Reply: true,
                        QuoteModal: { template: '<div></div>' },
                        ProfileActionsMenu: { template: '<div></div>' },
                    },
                    provide: {
                        snackbar: { showSnackbar: vi.fn(), handleShowSnackbar: vi.fn() },
                        confirmation: {
                            showConfirmation: vi.fn(),
                            handleShowConfirmation: vi.fn(),
                        },
                    },
                    mocks: { $router: { back: vi.fn() }, $t: (msg: string) => msg },
                },
            })

            expect(wrapper.find('.reply-form-stub').exists()).toBe(true)
        })

        it('renders replies when they exist', async () => {
            const mockReplies = [
                {
                    tweet_id: 'r1',
                    content: 'Reply 1',
                    user: { id: 'u2', name: 'Bob', username: 'bob' },
                },
                {
                    tweet_id: 'r2',
                    content: 'Reply 2',
                    user: { id: 'u3', name: 'Charlie', username: 'charlie' },
                },
            ]

            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref(mockTweetDetails),
                isLoading: ref(false),
                error: ref(null),
                replies: ref(mockReplies),
                fetchTweetDetails: vi.fn(),
            } as any)

            const wrapper = mount(TweetDetails, {
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                        ReplyForm: true,
                        Reply: { template: '<div class="reply-stub"></div>' },
                        QuoteModal: { template: '<div></div>' },
                        ProfileActionsMenu: { template: '<div></div>' },
                    },
                    provide: {
                        snackbar: { showSnackbar: vi.fn(), handleShowSnackbar: vi.fn() },
                        confirmation: {
                            showConfirmation: vi.fn(),
                            handleShowConfirmation: vi.fn(),
                        },
                    },
                    mocks: { $router: { back: vi.fn() }, $t: (msg: string) => msg },
                },
            })

            const replies = wrapper.findAll('.reply-stub')
            expect(replies.length).toBe(2)
        })
    })
})
