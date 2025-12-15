import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import Tweet from '../../components/Tweet/Tweet.vue'
import Publisher from '../../components/Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../../components/Tweet/subComponents/Content/Content.vue'
import Stats from '../../components/Tweet/subComponents/Stats/Stats.vue'
import type { Tweet as TweetType } from '../../types'

// Mock Nuxt composables and dependencies
vi.mock('#app', () => {
    const mock = {
        useNuxtApp: () => ({ $queryClient: {}, $userInfoService: {}, $tweetService: {} }),
        useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() }),
        useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} }),
        useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
        navigateTo: vi.fn(),
    }
    return { ...mock, default: mock }
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}))

vi.mock('../../stores/tweetTransition', () => ({
    useTweetTransitionStore: () => ({
        setTransitionTweet: vi.fn(),
    }),
}))

vi.mock('../../components/Tweet/subComponents/ProfileActionsMenu.vue', () => ({
    default: {
        template: '<div class="profile-actions-menu">ProfileActionsMenu</div>',
    },
}))

// Mock usePostTweet composable for QuoteModal
vi.mock('../../../TimeLine/queries/usePostTweet', () => ({
    usePostTweet: () => ({
        isPending: { value: false },
        mutateAsync: vi.fn(),
    }),
}))

// Mock useTweetQueries
vi.mock('../../queries/useTweetQueries', () => ({
    useTweetSummaryQuery: vi.fn(() => ({
        data: { value: null },
        isLoading: { value: false },
        error: { value: null },
        refetch: vi.fn(),
    })),
    useDeleteTweetMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: { value: false },
    })),
    useUpdateTweetMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: { value: false },
    })),
}))

const mockTweet: TweetType = {
    tweet_id: 't1',
    type: 'tweet',
    content: 'Hello world',
    images: ['https://example.com/image1.jpg'],
    videos: [],
    gifs: [],
    likes_count: 10,
    reposts_count: 3,
    views_count: 0,
    quotes_count: 0,
    replies_count: 5,
    is_liked: false,
    is_reposted: false,
    is_bookmarked: false,
    created_at: '2020-01-01',
    updated_at: '2020-01-02',
    user: {
        id: 'u1',
        name: 'Alice',
        username: 'alice',
        avatar_url: '/avatar.jpg',
        verified: false,
        is_following: null,
        link: null,
        bio: 'Test bio',
        followers_count: 100,
        following_count: 50,
        cover_url: null,
        country: null,
        created_at: '2020-01-01',
        birth_date: null,
        language: null,
        email: '',
    },
    reposted_by: undefined,
    parent_tweet: null,
    conversation_tweet: null,
}

// Mock navigation utilities
vi.mock('../../utils/navigation', () => ({
    getProfileUrl: vi.fn((user) => user.link || `/profile/${user.username}` || '#'),
    getTweetUrl: vi.fn((tweet) => `/${tweet.user.username}/status/${tweet.tweet_id}`),
}))

const defaultStubs = {
    NuxtLink: { template: '<a><slot /></a>' },
    Publisher: true,
    Content: true,
    Stats: true,
    TooltipProvider: { template: '<div><slot /></div>' },
    Tooltip: { template: '<div><slot /></div>' },
    TooltipTrigger: {
        template: '<div><slot /></div>',
        props: ['asChild'],
    },
    TooltipContent: true,
    UserCard: { template: '<div class="user-card">UserCard</div>' },
    ProfileActionsMenu: { template: '<div class="profile-actions-menu">ProfileActionsMenu</div>' },
    FormattedTextarea: { template: '<textarea />' },
    QuoteModal: { template: '<div class="quote-modal"></div>' },
}

const defaultGlobal = {
    stubs: defaultStubs,
    config: {
        globalProperties: {
            $t: (key: string) => key,
        },
    },
    mocks: {
        $t: (key: string) => key,
    },
    provide: {
        $t: (key: string) => key,
        snackbar: {
            showSnackbar: vi.fn(),
            handleShowSnackbar: vi.fn(),
        },
        confirmation: {
            showConfirmation: vi.fn(),
            handleShowConfirmation: vi.fn(),
        },
    },
    // Ensure $t is available on the instance
    plugins: [
        {
            install(app) {
                app.config.globalProperties.$t = (key) => key
            },
        },
    ],
}

describe('Tweet Component', () => {
    const mockSnackbar = {
        handleShowSnackbar: vi.fn(),
    }
    it('renders repost badge for reposted tweets', async () => {
        const tweet = {
            ...mockTweet,
            type: 'repost',
            reposted_by: { repost_id: 'r1', id: 'u2', name: 'Bob', reposted_at: '2020-01-02' },
        }
        const wrapper = mount(Tweet, {
            props: { tweet },
            global: {
                ...defaultGlobal,
                provide: {
                    ...defaultGlobal.provide,
                    snackbar: mockSnackbar,
                },
                mocks: { $t: (key) => key },
            },
        })
        expect(wrapper.text().toLowerCase()).toContain('repost')
    })

    it('renders ProfileActionsMenu for actions', async () => {
        const activeMenuTweetId = ref<string | null>(null)
        const wrapper = mount(Tweet, {
            props: { tweet: mockTweet },
            global: {
                ...defaultGlobal,
                provide: {
                    ...defaultGlobal.provide,
                    snackbar: mockSnackbar,
                    activeMenuTweetId,
                },
                mocks: { $t: (key) => key },
            },
        })
        activeMenuTweetId.value = mockTweet.tweet_id
        await nextTick()
        expect(wrapper.find('.profile-actions-menu').exists()).toBe(true)
    })

    it('shows QuoteModal when quoting', async () => {
        const wrapper = mount(Tweet, {
            props: { tweet: mockTweet },
            global: {
                ...defaultGlobal,
                provide: {
                    ...defaultGlobal.provide,
                    snackbar: mockSnackbar,
                },
            },
        })
        // Simulate quote action
        // Use a workaround for non-extensible objects
        wrapper.vm.showQuoteModal = true
        await nextTick()
        expect(wrapper.find('.quote-modal').exists()).toBe(true)
    })

    it('shows UserCard tooltip on avatar hover', async () => {
        const wrapper = mount(Tweet, {
            props: { tweet: mockTweet },
            global: {
                ...defaultGlobal,
                provide: {
                    ...defaultGlobal.provide,
                    snackbar: mockSnackbar,
                },
                stubs: {
                    ...defaultStubs,
                    NuxtLink: { template: '<a><slot /></a>' },
                    UserCard: { template: '<div class="user-card">UserCard</div>' },
                    CustomToolTip: {
                        template: '<div><slot name="trigger" /><slot name="content" /></div>',
                    },
                },
                mocks: { $t: (key) => key },
            },
        })
        // The UserCard should now be present in the DOM
        expect(wrapper.find('.user-card').exists()).toBe(true)
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Basic Structure', () => {
        it('renders avatar image and NuxtLink to profile', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            // Check that the article element exists
            const article = wrapper.find('article')
            expect(article.exists()).toBe(true)

            // Check that the NuxtLink has the correct `to` prop
            const link = wrapper.find('#tweet-avatar-link-t1')
            expect(link.exists()).toBe(true)
            expect(link.attributes('to')).toBe('/profile/alice')

            // Check that the Tweet ID is set correctly
            expect(article.attributes('id')).toBe('tweet-t1')
        })

        it('renders with correct CSS classes for article container', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const article = wrapper.find('article')
            expect(article.exists()).toBe(true)
            expect(article.classes()).toContain('border-b')
            expect(article.classes()).toContain('cursor-pointer')
        })

        it('renders with flex layout structure', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const flexContainer = wrapper.find('.flex.gap-3')
            expect(flexContainer.exists()).toBe(true)
        })
    })

    describe('Sub-component Integration', () => {
        it('renders Publisher component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const publisher = wrapper.findComponent(Publisher)
            expect(publisher.exists()).toBe(true)
            expect(publisher.props('publisher')).toMatchObject({
                id: mockTweet.user.id,
                name: mockTweet.user.name,
                username: mockTweet.user.username,
                avatar: mockTweet.user.avatar_url,
            })
            expect(publisher.props('createdAt')).toBe('2020-01-01')
        })

        it('renders Content component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const content = wrapper.findComponent(Content)
            expect(content.exists()).toBe(true)
            expect(content.props('content')).toMatchObject({
                text: mockTweet.content,
                images: mockTweet.images,
                videos: [],
            })
        })

        it('renders Stats component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.exists()).toBe(true)
            // The actual stats prop may include more fields, so check for a subset
            const statsProps = stats.props('stats')
            expect(statsProps.likes).toBe(mockTweet.likes_count)
            expect(statsProps.replies).toBe(mockTweet.replies_count)
            expect(statsProps.retweets).toBe(mockTweet.reposts_count)
            expect(statsProps.views).toBe(mockTweet.views_count)
        })

        it('renders all three sub-components together', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            expect(wrapper.findComponent(Publisher).exists()).toBe(true)
            expect(wrapper.findComponent(Content).exists()).toBe(true)
            expect(wrapper.findComponent(Stats).exists()).toBe(true)
        })
    })

    describe('Click Handling', () => {
        it('calls navigateToTweet when article is clicked', async () => {
            const { navigateTo } = await import('#app')
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })

        it('stops propagation when avatar link is clicked', async () => {
            const { navigateTo } = await import('#app')
            vi.mocked(navigateTo).mockClear()

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const link = wrapper.find('#tweet-avatar-link-t1')
            await link.trigger('click')

            // The @click.stop should prevent the article click from firing
            expect(navigateTo).not.toHaveBeenCalled()
        })

        it('does not navigate when tweetUrl is #', async () => {
            const { getTweetUrl } = await import('../../utils/navigation')
            vi.mocked(getTweetUrl).mockReturnValue('#')

            const { navigateTo } = await import('#app')
            vi.mocked(navigateTo).mockClear()

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).not.toHaveBeenCalled()
        })
    })

    describe('Different Tweet Types', () => {
        it('renders tweet with custom user link', async () => {
            const tweetWithCustomLink: TweetType = {
                ...mockTweet,
                user: {
                    ...mockTweet.user,
                    link: '/custom/profile/alice',
                },
            }

            const { getProfileUrl } = await import('../../utils/navigation')
            vi.mocked(getProfileUrl).mockReturnValue('/custom/profile/alice')

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithCustomLink },
                global: { ...defaultGlobal },
            })

            const link = wrapper.find('#tweet-avatar-link-t1')
            expect(link.attributes('to')).toBe('/custom/profile/alice')
        })

        it('renders tweet with media content', () => {
            const tweetWithMedia: TweetType = {
                ...mockTweet,
                content: 'Check out this image!',
                images: ['/image1.jpg'],
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithMedia },
                global: { ...defaultGlobal },
            })

            const content = wrapper.findComponent(Content)
            expect(content.props('content')).toMatchObject({
                text: 'Check out this image!',
                images: ['/image1.jpg'],
            })
        })

        it('renders tweet with video content', () => {
            const tweetWithVideo: TweetType = {
                ...mockTweet,
                content: 'Check out this video!',
                videos: ['/video.mp4'],
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithVideo },
                global: { ...defaultGlobal },
            })

            const content = wrapper.findComponent(Content)
            expect(content.props('content').videos?.[0]).toBe('/video.mp4')
        })

        it('renders tweet with views in stats', () => {
            const tweetWithViews: TweetType = {
                ...mockTweet,
                views_count: 1000,
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithViews },
                global: { ...defaultGlobal },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.props('stats').views).toBe(1000)
        })

        it('renders tweet with zero stats', () => {
            const tweetWithZeroStats: TweetType = {
                ...mockTweet,
                likes_count: 0,
                replies_count: 0,
                reposts_count: 0,
                views_count: 0,
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithZeroStats },
                global: { ...defaultGlobal },
            })

            const stats = wrapper.findComponent(Stats)
            const statsProps = stats.props('stats')
            expect(statsProps.likes).toBe(0)
            expect(statsProps.replies).toBe(0)
            expect(statsProps.retweets).toBe(0)
            expect(statsProps.views).toBe(0)
        })
    })

    describe('Conditional Rendering', () => {
        it('renders different user avatars correctly', () => {
            const tweetWithDifferentAvatar: TweetType = {
                ...mockTweet,
                user: {
                    ...mockTweet.user,
                    avatar_url: '/different-avatar.png',
                    name: 'Bob',
                },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithDifferentAvatar },
                global: { ...defaultGlobal },
            })

            // Verify that the user prop was passed correctly to Publisher component
            const publisher = wrapper.findComponent(Publisher)
            expect(publisher.exists()).toBe(true)
            expect(publisher.props('publisher').avatar_url).toBe('/different-avatar.png')
            expect(publisher.props('publisher').name).toBe('Bob')
        })

        it('updates when tweet prop changes', async () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const newTweet: TweetType = {
                ...mockTweet,
                tweet_id: 't2',
                content: 'Updated tweet',
                likes_count: 100,
                replies_count: 50,
                reposts_count: 25,
            }

            await wrapper.setProps({ tweet: newTweet })

            const content = wrapper.findComponent(Content)
            const stats = wrapper.findComponent(Stats)

            expect(content.props('content').text).toBe('Updated tweet')
            expect(stats.props('stats').likes).toBe(100)
        })

        it('renders with minimum required fields', () => {
            const minimalTweet: TweetType = {
                tweet_id: 't-minimal',
                content: 'Minimal tweet',
                user: {
                    id: 'u-minimal',
                    name: 'Minimal User',
                    username: 'minimal',
                    avatar_url: '/minimal.jpg',
                    verified: false,
                },
                likes_count: 0,
                replies_count: 0,
                reposts_count: 0,
                views_count: 0,
                qoutes_count: 0,
                is_liked: false,
                is_reposted: false,
                created_at: '2020-01-01',
                type: 'tweet',
            }

            const wrapper = mount(Tweet, {
                props: { tweet: minimalTweet },
                global: { ...defaultGlobal },
            })

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('article').exists()).toBe(true)
        })
    })

    describe('Computed Properties', () => {
        it('computes profileUrl correctly', async () => {
            // Reset the mock to default behavior
            const { getProfileUrl } = await import('../../utils/navigation')
            vi.mocked(getProfileUrl).mockImplementation(
                (user) => user.link || `/profile/${user.username}` || '#',
            )

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            const link = wrapper.find('#tweet-avatar-link-t1')
            expect(link.attributes('to')).toBe('/profile/alice')
        })

        it('computes tweetUrl correctly', async () => {
            // Reset mocks to default behavior
            const { navigateTo } = await import('#app')
            const { getTweetUrl } = await import('../../utils/navigation')
            vi.mocked(getTweetUrl).mockImplementation(
                (tweet) => `/${tweet.user.username}/status/${tweet.tweet_id}`,
            )
            vi.mocked(navigateTo).mockClear()

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: { ...defaultGlobal },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })
    })
})
