import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { shallowReactive } from 'vue'
import Reply from '../../components/TweetDetails/Reply/Reply.vue'

// Mock Nuxt composables FIRST
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
    useNuxtApp: () => ({
        $queryClient: {},
        $userInfoService: {},
        $tweetService: {},
    }),
}))

// Mock user store for Stats.vue
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        getUser: () => ({ user_id: 'u1' }),
    }),
}))
// Mock Stats.vue composable dependencies
const likeMutate = vi.fn()
const repostMutate = vi.fn()
const bookmarkMutate = vi.fn()
vi.mock('../../queries/useTweetQueries', () => ({
    mutateTweetLikesQuery: () => ({ mutate: likeMutate, isPending: false }),
    mutateTweetRepostsQuery: () => ({ mutate: repostMutate, isPending: false }),
    mutateTweetBookmarkQuery: () => ({ mutate: bookmarkMutate, isPending: false }),
    useDeleteTweetMutation: () => ({ mutateAsync: vi.fn() }),
    useUpdateTweetMutation: () => ({ mutateAsync: vi.fn() }),
}))

// Mock NuxtLink and CustomToolTip
const stubs = {
    NuxtLink: { template: '<a><slot /></a>' },
    CustomToolTip: { template: '<div><slot name="trigger" /><slot name="content" /></div>' },
    UserCard: { template: '<div class="user-card">UserCard</div>' },
}

// Mock i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}))

// Mock navigation utils
vi.mock('../../utils/navigation', () => ({
    getProfileUrl: vi.fn((user) => user.link || `/profile/${user.username}` || '#'),
    getTweetUrl: vi.fn((tweet) => `/${tweet.user.username}/status/${tweet.tweet_id}`),
}))

vi.mock('~/modules/profile/composables/useSnackbar', () => ({
    useSnackbar: () => ({
        showSnackbar: vi.fn(),
        handleShowSnackbar: vi.fn(),
    }),
}))

vi.mock('~/modules/profile/composables/useConfirmation', () => ({
    useConfirmation: () => ({
        showConfirmation: vi.fn(),
        handleShowConfirmation: vi.fn(),
    }),
}))

// Mock Pinia store
vi.mock('../../stores/tweetTransition', () => ({
    useTweetTransitionStore: () => ({ setTransitionTweet: vi.fn() }),
}))

describe('Reply Component', () => {
    const mockSnackbar = { handleShowSnackbar: vi.fn() }
    const global = {
        provide: {
            snackbar: mockSnackbar,
            confirmation: {
                showConfirmation: vi.fn(),
                handleShowConfirmation: vi.fn(),
            },
        },
        stubs,
        mocks: { $t: (key) => key },
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })
    describe('Reply Component', () => {
        it('renders reply content', () => {
            const reply = shallowReactive({
                tweet_id: 'r1',
                type: 'reply',
                content: 'Reply content',
                images: [],
                videos: [],
                gifs: [],
                likes_count: 0,
                reposts_count: 0,
                views_count: 0,
                quotes_count: 0,
                replies_count: 0,
                is_liked: false,
                is_reposted: false,
                is_bookmarked: false,
                created_at: '2020-01-01',
                updated_at: '2020-01-01',
                user: {
                    id: 'u1',
                    name: 'Alice',
                    username: 'alice',
                    avatar_url: '/avatar.jpg',
                    verified: false,
                    is_following: null,
                    link: null,
                    bio: null,
                    followers_count: null,
                    following_count: null,
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
            })
            const wrapper = mount(Reply, { props: { reply }, global })
            expect(wrapper.text()).toContain('Reply content')
            expect(wrapper.text()).toContain('Alice')
        })

        it('renders with all media fields', () => {
            const reply = shallowReactive({
                tweet_id: 'r2',
                type: 'reply',
                content: 'Media reply',
                images: ['/img1.jpg'],
                videos: ['/vid1.mp4'],
                gifs: ['/gif1.gif'],
                likes_count: 2,
                reposts_count: 1,
                views_count: 5,
                quotes_count: 0,
                replies_count: 1,
                is_liked: true,
                is_reposted: false,
                is_bookmarked: true,
                created_at: '2020-01-02',
                updated_at: '2020-01-02',
                user: {
                    id: 'u2',
                    name: 'Bob',
                    username: 'bob',
                    avatar_url: '',
                    verified: false,
                    is_following: null,
                    link: null,
                    bio: 'Bio',
                    followers_count: 10,
                    following_count: 5,
                    cover_url: null,
                    country: null,
                    created_at: '2020-01-02',
                    birth_date: null,
                    language: null,
                    email: '',
                },
                reposted_by: undefined,
                parent_tweet: null,
                conversation_tweet: null,
            })
            const wrapper = mount(Reply, { props: { reply }, global })
            expect(wrapper.text()).toContain('Media reply')
            expect(wrapper.text()).toContain('Bob')
            // Avatar fallback should be used
            expect(wrapper.html()).toContain('ui-avatars.com')
            // Should render stats and content
            expect(wrapper.findComponent({ name: 'Stats' }).exists()).toBe(true)
            expect(wrapper.findComponent({ name: 'Content' }).exists()).toBe(true)
        })

        it('calls navigation handler when article is clicked', async () => {
            const reply = shallowReactive({
                tweet_id: 'r3',
                type: 'reply',
                content: 'Navigate me',
                images: [],
                videos: [],
                gifs: [],
                likes_count: 0,
                reposts_count: 0,
                views_count: 0,
                quotes_count: 0,
                replies_count: 0,
                is_liked: false,
                is_reposted: false,
                is_bookmarked: false,
                created_at: '2020-01-03',
                updated_at: '2020-01-03',
                user: {
                    id: 'u3',
                    name: 'Carol',
                    username: 'carol',
                    avatar_url: '/avatar3.jpg',
                    verified: false,
                    is_following: null,
                    link: null,
                    bio: null,
                    followers_count: null,
                    following_count: null,
                    cover_url: null,
                    country: null,
                    created_at: '2020-01-03',
                    birth_date: null,
                    language: null,
                    email: '',
                },
                reposted_by: undefined,
                parent_tweet: null,
                conversation_tweet: null,
            })
            const { navigateTo } = await import('#app')
            const wrapper = mount(Reply, { props: { reply }, global })
            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalled()
        })

        it('does not trigger navigation when avatar link is clicked', async () => {
            const reply = shallowReactive({
                tweet_id: 'r4',
                type: 'reply',
                content: 'Avatar click',
                images: [],
                videos: [],
                gifs: [],
                likes_count: 0,
                reposts_count: 0,
                views_count: 0,
                quotes_count: 0,
                replies_count: 0,
                is_liked: false,
                is_reposted: false,
                is_bookmarked: false,
                created_at: '2020-01-04',
                updated_at: '2020-01-04',
                user: {
                    id: 'u4',
                    name: 'Dave',
                    username: 'dave',
                    avatar_url: '/avatar4.jpg',
                    verified: false,
                    is_following: null,
                    link: null,
                    bio: null,
                    followers_count: null,
                    following_count: null,
                    cover_url: null,
                    country: null,
                    created_at: '2020-01-04',
                    birth_date: null,
                    language: null,
                    email: '',
                },
                reposted_by: undefined,
                parent_tweet: null,
                conversation_tweet: null,
            })
            const { navigateTo } = await import('#app')
            vi.mocked(navigateTo).mockClear()
            const wrapper = mount(Reply, { props: { reply }, global })
            await wrapper.find('#reply-avatar-link-r4').trigger('click')
            expect(navigateTo).not.toHaveBeenCalled()
        })

        it('passes correct props to subcomponents', () => {
            const reply = shallowReactive({
                tweet_id: 'r5',
                type: 'reply',
                content: 'Subcomponent test',
                images: ['/img2.jpg'],
                videos: [],
                gifs: [],
                likes_count: 7,
                reposts_count: 2,
                views_count: 3,
                quotes_count: 0,
                replies_count: 1,
                is_liked: true,
                is_reposted: false,
                is_bookmarked: false,
                created_at: '2020-01-05',
                updated_at: '2020-01-05',
                user: {
                    id: 'u5',
                    name: 'Eve',
                    username: 'eve',
                    avatar_url: '/avatar5.jpg',
                    verified: false,
                    is_following: null,
                    link: null,
                    bio: 'Bio Eve',
                    followers_count: 5,
                    following_count: 2,
                    cover_url: null,
                    country: null,
                    created_at: '2020-01-05',
                    birth_date: null,
                    language: null,
                    email: '',
                },
                reposted_by: undefined,
                parent_tweet: null,
                conversation_tweet: null,
            })
            const wrapper = mount(Reply, { props: { reply }, global })
            // Publisher
            const publisher = wrapper.findComponent({ name: 'Publisher' })
            expect(publisher.exists()).toBe(true)
            expect(publisher.props('publisher').name).toBe('Eve')
            // Content
            const content = wrapper.findComponent({ name: 'Content' })
            expect(content.exists()).toBe(true)
            expect(content.props('content').text).toBe('Subcomponent test')
            // Stats
            const stats = wrapper.findComponent({ name: 'Stats' })
            expect(stats.exists()).toBe(true)
            expect(stats.props('stats').likes).toBe(7)
        })

        it('renders with missing optional user fields', () => {
            const reply = shallowReactive({
                tweet_id: 'r6',
                type: 'reply',
                content: '',
                images: [],
                videos: [],
                gifs: [],
                likes_count: 0,
                reposts_count: 0,
                views_count: 0,
                quotes_count: 0,
                replies_count: 0,
                is_liked: false,
                is_reposted: false,
                is_bookmarked: false,
                created_at: '2020-01-06',
                updated_at: '2020-01-06',
                user: {
                    id: 'u6',
                    name: 'Frank',
                    username: 'frank',
                    avatar_url: '',
                    verified: false,
                },
                reposted_by: undefined,
                parent_tweet: null,
                conversation_tweet: null,
            })
            const wrapper = mount(Reply, { props: { reply }, global })
            expect(wrapper.text()).toContain('Frank')
            // Should fallback to avatar URL
            expect(wrapper.html()).toContain('ui-avatars.com')
        })
    })
})
