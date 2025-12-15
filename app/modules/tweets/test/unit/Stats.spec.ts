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
    const mockSnackbar = { show: vi.fn() }
    const global = {
        provide: { snackbar: mockSnackbar },
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
})
