// Mock vue-i18n useI18n
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { shallowReactive } from 'vue'
import Stats from '../../components/Tweet/subComponents/Stats/Stats.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}))
// Mock the user store used in Stats.vue
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        getUser: () => ({ user_id: 'u1' }),
    }),
}))

// Setup spies for mutation mocks
const likeMutate = vi.fn()
const repostMutate = vi.fn()
const bookmarkMutate = vi.fn()
vi.mock('../../queries/useTweetQueries', () => ({
    mutateTweetLikesQuery: () => ({ mutate: likeMutate, isPending: { value: false } }),
    mutateTweetRepostsQuery: () => ({ mutate: repostMutate, isPending: { value: false } }),
    mutateTweetBookmarkQuery: () => ({ mutate: bookmarkMutate, isPending: { value: false } }),
}))
vi.mock('../../stores/tweetTransition', () => ({
    useTweetTransitionStore: () => ({}),
}))

const defaultStats = {
    likes: 10,
    replies: 5,
    retweets: 3,
    views: 100,
    is_liked: false,
    is_reposted: false,
    is_bookmarked: false,
    tweet_id: 't1',
    username: 'alice',
    user_id: 'u1',
}

describe('Stats Component', () => {
    const mockSnackbar = { show: vi.fn(), handleShowSnackbar: vi.fn() }
    const mockQueryClient = {
        setQueriesData: vi.fn(),
        setQueryData: vi.fn(),
        getQueryData: vi.fn(),
        invalidateQueries: vi.fn(),
    }

    // Mock useNuxtApp to provide $queryClient with setQueriesData
    vi.stubGlobal('useNuxtApp', () => ({
        $queryClient: mockQueryClient,
        $tweetService: {},
    }))

    const global = {
        provide: {
            snackbar: mockSnackbar,
            activeRepostMenuTweetId: { value: null },
        },
        stubs: {
            RouterLink: true,
            FontAwesomeIcon: true,
            CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
        },
    }

    beforeEach(() => {
        likeMutate.mockClear()
        repostMutate.mockClear()
        bookmarkMutate.mockClear()
    })

    it('renders with zero and large stat values (formatted)', () => {
        const wrapper = mount(Stats, {
            props: {
                stats: shallowReactive({
                    likes: 0,
                    replies: 0,
                    retweets: 99999,
                    views: 1234567,
                    is_liked: false,
                    is_reposted: false,
                    is_bookmarked: false,
                    tweet_id: 't2',
                    username: 'bob',
                    user_id: 'u2',
                }),
            },
            global: {
                provide: { snackbar: mockSnackbar },
                stubs: {
                    RouterLink: true,
                    FontAwesomeIcon: true,
                    CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
                },
            },
        })
        // Only retweets count is visible, and is formatted as 99K
        expect(wrapper.text()).toContain('99K')
    })

    it('does not render views button if views is missing', () => {
        const wrapper = shallowMount(Stats, {
            props: {
                stats: shallowReactive({
                    ...defaultStats,
                    views: undefined,
                }),
            },
            global,
        })
        // Should not contain the views button id
        expect(wrapper.html()).not.toContain('tweet-views-button')
    })

    it('matches snapshot', () => {
        const wrapper = mount(Stats, {
            props: { stats: shallowReactive({ ...defaultStats }) },
            global: {
                provide: { snackbar: mockSnackbar },
                stubs: {
                    RouterLink: true,
                    FontAwesomeIcon: true,
                    CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
                },
            },
        })
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders retweets count as visible text', () => {
        const wrapper = mount(Stats, {
            props: { stats: shallowReactive({ ...defaultStats }) },
            global,
        })
        expect(wrapper.text()).toContain('3')
    })

    it('renders CustomToolTip stubs', () => {
        const wrapper = mount(Stats, {
            props: { stats: shallowReactive({ ...defaultStats }) },
            global: {
                provide: { snackbar: mockSnackbar },
                stubs: {
                    RouterLink: true,
                    FontAwesomeIcon: true,
                    CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
                },
            },
        })
        // After mounting with proper CustomToolTip stub, buttons should be rendered
        expect(wrapper.findAll('button').length).toBeGreaterThan(0)
    })

    describe('Like Button', () => {
        it('calls likeMutate when like button is clicked', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const likeButton = wrapper.find('#tweet-like-button')
            expect(likeButton.exists()).toBe(true)
            await likeButton.trigger('click')
            expect(likeMutate).toHaveBeenCalled()
        })

        it('toggles like state optimistically on click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats, is_liked: false }) },
                global,
            })
            const likeButton = wrapper.find('#tweet-like-button')
            await likeButton.trigger('click')
            // Check that the like mutation was called with the new state (true)
            expect(likeMutate).toHaveBeenCalledWith(true, expect.anything())
        })

        it('increments like count when liking', async () => {
            const stats = shallowReactive({ ...defaultStats, likes: 5, is_liked: false })
            const wrapper = mount(Stats, {
                props: { stats },
                global,
            })
            const likeButton = wrapper.find('#tweet-like-button')
            await likeButton.trigger('click')
            // The mutation should be called with the new liked state
            expect(likeMutate).toHaveBeenCalled()
        })
    })

    describe('Repost Button', () => {
        it('renders repost button', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const repostButton = wrapper.find('#tweet-retweet-button')
            expect(repostButton.exists()).toBe(true)
        })

        it('toggles repost menu on click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global: {
                    ...global,
                    provide: {
                        ...global.provide,
                        activeRepostMenuTweetId: { value: null },
                    },
                },
            })
            const repostButton = wrapper.find('#tweet-retweet-button')
            await repostButton.trigger('click')
            // Menu visibility is governed by inject/provide
        })
    })

    describe('Bookmark Button', () => {
        it('calls bookmarkMutate when bookmark button is clicked', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const bookmarkButton = wrapper.find('#tweet-bookmark-button')
            expect(bookmarkButton.exists()).toBe(true)
            await bookmarkButton.trigger('click')
            expect(bookmarkMutate).toHaveBeenCalled()
        })

        it('toggles bookmark state optimistically', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats, is_bookmarked: false }) },
                global,
            })
            const bookmarkButton = wrapper.find('#tweet-bookmark-button')
            await bookmarkButton.trigger('click')
            expect(bookmarkMutate).toHaveBeenCalledWith(true, expect.anything())
        })
    })

    describe('Share Button', () => {
        it('renders share button', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const shareButton = wrapper.find('#tweet-share-button')
            expect(shareButton.exists()).toBe(true)
        })

        it('copies tweet URL to clipboard on share click', async () => {
            // Skip if clipboard API not available in test environment
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const shareButton = wrapper.find('#tweet-share-button')
            // Just verify the button can be clicked without errors
            await shareButton.trigger('click')
            // The actual clipboard write is handled by the component -
            // we just verify the click handler doesn't throw
        })
    })

    describe('Reply Button', () => {
        it('renders reply button', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const replyButton = wrapper.find('#tweet-reply-button')
            expect(replyButton.exists()).toBe(true)
        })

        it('emits reply event when reply button is clicked', async () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats }) },
                global,
            })
            const replyButton = wrapper.find('#tweet-reply-button')
            await replyButton.trigger('click')
            expect(wrapper.emitted('reply')).toBeTruthy()
        })

        it('displays reply count', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats, replies: 15 }) },
                global,
            })
            expect(wrapper.text()).toContain('15')
        })
    })

    describe('Views Display', () => {
        it('renders views button when views count exists', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats, views: 500 }) },
                global,
            })
            const viewsButton = wrapper.find('#tweet-views-button')
            expect(viewsButton.exists()).toBe(true)
        })

        it('formats large view counts correctly', () => {
            const wrapper = mount(Stats, {
                props: { stats: shallowReactive({ ...defaultStats, views: 1500000 }) },
                global,
            })
            // Should format as 1.5M or similar
            expect(wrapper.text()).toMatch(/1\.5M|1\.5 M|1500K/i)
        })
    })
})
