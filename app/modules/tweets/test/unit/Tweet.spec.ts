import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tweet from '../../components/Tweet/Tweet.vue'
import Publisher from '../../components/Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../../components/Tweet/subComponents/Content/Content.vue'
import Stats from '../../components/Tweet/subComponents/Stats/Stats.vue'
import type { Tweet as TweetType } from '../../types'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
}))

// Mock navigation utilities
vi.mock('../../utils/navigation', () => ({
    getProfileUrl: vi.fn((user) => user.link || `/profile/${user.username}` || '#'),
    getTweetUrl: vi.fn((tweet) => `/${tweet.user.username}/status/${tweet.tweet_id}`),
}))

const defaultStubs = {
    NuxtLink: true,
    Publisher: true,
    Content: true,
    Stats: true,
    TooltipProvider: { template: '<div><slot /></div>' },
    Tooltip: { template: '<div><slot /></div>' },
    TooltipTrigger: {
        template: '<div><slot /></div>',
        props: ['asChild']
    },
    TooltipContent: true,
    UserCard: true,
}

describe('Tweet Component', () => {
    const mockTweet: TweetType = {
        tweet_id: 't1',
        content: 'Hello world',
        user: {
            id: 'u1',
            name: 'Alice',
            username: 'alice',
            avatar_url: '/avatar.jpg',
            verified: false,
            bio: 'Test bio',
            followers: 100,
            following: 50
        },
        images: [
            "https://example.com/image1.jpg",
        ],
        likes_count: 10,
        replies_count: 5,
        reposts_count: 3,
        views_count: 0,
        qoutes_count: 0,
        is_liked: false,
        is_reposted: false,
        created_at: '2020-01-01',
        type: 'tweet',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Basic Structure', () => {
        it('renders avatar image and NuxtLink to profile', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
            })

            const article = wrapper.find('article')
            expect(article.exists()).toBe(true)
            expect(article.classes()).toContain('border-b')
            expect(article.classes()).toContain('cursor-pointer')
        })

        it('renders with flex layout structure', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
            })

            const flexContainer = wrapper.find('.flex.gap-3')
            expect(flexContainer.exists()).toBe(true)
        })
    })

    describe('Sub-component Integration', () => {
        it('renders Publisher component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.exists()).toBe(true)
            expect(stats.props('stats')).toEqual({
                likes: mockTweet.likes_count,
                replies: mockTweet.replies_count,
                retweets: mockTweet.reposts_count,
                views: mockTweet.views_count,
            })
        })

        it('renders all three sub-components together', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })

        it('stops propagation when avatar link is clicked', async () => {
            const { navigateTo } = await import('#app')
            vi.mocked(navigateTo).mockClear()
            
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.props('stats')).toEqual({
                likes: 0,
                replies: 0,
                retweets: 0,
                views: 0,
            })
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
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
                global: {
                    stubs: defaultStubs,
                },
            })

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('article').exists()).toBe(true)
        })
    })

    describe('Computed Properties', () => {
        it('computes profileUrl correctly', async () => {
            // Reset the mock to default behavior
            const { getProfileUrl } = await import('../../utils/navigation')
            vi.mocked(getProfileUrl).mockImplementation((user) => user.link || `/profile/${user.username}` || '#')

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
            })

            const link = wrapper.find('#tweet-avatar-link-t1')
            expect(link.attributes('to')).toBe('/profile/alice')
        })

        it('computes tweetUrl correctly', async () => {
            // Reset mocks to default behavior
            const { navigateTo } = await import('#app')
            const { getTweetUrl } = await import('../../utils/navigation')
            vi.mocked(getTweetUrl).mockImplementation((tweet) => `/${tweet.user.username}/status/${tweet.tweet_id}`)
            vi.mocked(navigateTo).mockClear()

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: defaultStubs,
                },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })
    })
})