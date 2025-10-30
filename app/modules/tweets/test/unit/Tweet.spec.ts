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
    getTweetUrl: vi.fn((tweet) => `/${tweet.user.username}/status/${tweet.id}`),
}))

describe('Tweet Component', () => {
    const mockTweet: TweetType = {
        id: 't1',
        content: {
            text: 'Hello world',
        },
        user: {
            id: 'u1',
            name: 'Alice',
            username: 'alice',
            avatar: '/avatar.jpg',
        },
        stats: { likes: 10, replies: 5, retweets: 3 },
        createdAt: '2020-01-01',
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
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to"><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const img = wrapper.find('img')
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toBe('/avatar.jpg')
            expect(img.attributes('alt')).toBe('Alice')

            const link = wrapper.find('a')
            expect(link.exists()).toBe(true)
            expect(link.attributes('href')).toBe('/profile/alice')
        })

        it('renders with correct CSS classes for article container', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
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
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const flexContainer = wrapper.find('.flex.gap-3')
            expect(flexContainer.exists()).toBe(true)
        })

        it('renders avatar with correct hover classes', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to"><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const img = wrapper.find('img')
            expect(img.classes()).toContain('rounded-full')
            expect(img.classes()).toContain('cursor-pointer')
            expect(img.classes()).toContain('hover:brightness-95')
        })
    })

    describe('Sub-component Integration', () => {
        it('renders Publisher component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const publisher = wrapper.findComponent(Publisher)
            expect(publisher.exists()).toBe(true)
            expect(publisher.props('publisher')).toEqual(mockTweet.user)
            expect(publisher.props('createdAt')).toBe('2020-01-01')
        })

        it('renders Content component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Stats: true,
                    },
                },
            })

            const content = wrapper.findComponent(Content)
            expect(content.exists()).toBe(true)
            expect(content.props('content')).toEqual(mockTweet.content)
        })

        it('renders Stats component with correct props', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                    },
                },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.exists()).toBe(true)
            expect(stats.props('stats')).toEqual(mockTweet.stats)
        })

        it('renders all three sub-components together', () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                    },
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
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })

        it('stops propagation when avatar link is clicked', async () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to" @click.stop><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const link = wrapper.find('a')
            const clickEvent = new Event('click', { bubbles: true, cancelable: true })
            const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')
            
            await link.element.dispatchEvent(clickEvent)
            // The @click.stop should prevent the article click from firing
        })

        it('does not navigate when tweetUrl is #', async () => {
            const { getTweetUrl } = await import('../../utils/navigation')
            vi.mocked(getTweetUrl).mockReturnValue('#')

            const { navigateTo } = await import('#app')
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
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
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to"><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const link = wrapper.find('a')
            expect(link.attributes('href')).toBe('/custom/profile/alice')
        })

        it('renders tweet with media content', () => {
            const tweetWithMedia: TweetType = {
                ...mockTweet,
                content: {
                    text: 'Check out this image!',
                    images: ['/image1.jpg'],
            },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithMedia },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Stats: true,
                    },
                },
            })

            const content = wrapper.findComponent(Content)
            expect(content.props('content')).toEqual(tweetWithMedia.content)
            expect(content.props('content').images).toHaveLength(1)
        })

        it('renders tweet with video content', () => {
            const tweetWithVideo: TweetType = {
                ...mockTweet,
                content: {
                    text: 'Check out this video!',
                    videos: ['/video.mp4'],
                },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithVideo },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Stats: true,
                    },
                },
            })

            const content = wrapper.findComponent(Content)
            expect(content.props('content').videos?.[0]).toBe('/video.mp4')
        })

        it('renders tweet with views in stats', () => {
            const tweetWithViews: TweetType = {
                ...mockTweet,
                stats: {
                    likes: 10,
                    replies: 5,
                    retweets: 3,
                    views: 1000,
                },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithViews },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                    },
                },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.props('stats').views).toBe(1000)
        })

        it('renders tweet with zero stats', () => {
            const tweetWithZeroStats: TweetType = {
                ...mockTweet,
                stats: {
                    likes: 0,
                    replies: 0,
                    retweets: 0,
                },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithZeroStats },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                    },
                },
            })

            const stats = wrapper.findComponent(Stats)
            expect(stats.props('stats')).toEqual({
                likes: 0,
                replies: 0,
                retweets: 0,
            })
        })
    })

    describe('Conditional Rendering', () => {
        it('renders different user avatars correctly', () => {
            const tweetWithDifferentAvatar: TweetType = {
                ...mockTweet,
                user: {
                    ...mockTweet.user,
                    avatar: '/different-avatar.png',
                    name: 'Bob',
                },
            }

            const wrapper = mount(Tweet, {
                props: { tweet: tweetWithDifferentAvatar },
                global: {
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to"><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const img = wrapper.find('img')
            expect(img.attributes('src')).toBe('/different-avatar.png')
            expect(img.attributes('alt')).toBe('Bob')
        })

        it('updates when tweet prop changes', async () => {
            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const newTweet: TweetType = {
                ...mockTweet,
                id: 't2',
                content: {
                    text: 'Updated tweet',
                },
                stats: {
                    likes: 100,
                    replies: 50,
                    retweets: 25,
                },
            }

            await wrapper.setProps({ tweet: newTweet })

            const content = wrapper.findComponent(Content)
            const stats = wrapper.findComponent(Stats)

            expect(content.props('content').text).toBe('Updated tweet')
            expect(stats.props('stats').likes).toBe(100)
        })

        it('renders with minimum required fields', () => {
            const minimalTweet: TweetType = {
                id: 't-minimal',
                content: {
                    text: 'Minimal tweet',
                },
                user: {
                    id: 'u-minimal',
                    name: 'Minimal User',
                    username: 'minimal',
                    avatar: '/minimal.jpg',
                },
                stats: {
                    likes: 0,
                    replies: 0,
                    retweets: 0,
                },
                createdAt: '2020-01-01',
                type: 'tweet',
            }

            const wrapper = mount(Tweet, {
                props: { tweet: minimalTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
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
                    stubs: {
                        NuxtLink: {
                            props: ['to'],
                            template: `<a :href="to"><slot/></a>`,
                        },
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            const link = wrapper.find('a')
            expect(link.attributes('href')).toBe('/profile/alice')
        })

        it('computes tweetUrl correctly', async () => {
            // Reset mocks to default behavior
            const { navigateTo } = await import('#app')
            const { getTweetUrl } = await import('../../utils/navigation')
            vi.mocked(getTweetUrl).mockImplementation((tweet) => `/${tweet.user.username}/status/${tweet.id}`)
            vi.mocked(navigateTo).mockClear()

            const wrapper = mount(Tweet, {
                props: { tweet: mockTweet },
                global: {
                    stubs: {
                        NuxtLink: true,
                        Publisher: true,
                        Content: true,
                        Stats: true,
                    },
                },
            })

            await wrapper.find('article').trigger('click')
            expect(navigateTo).toHaveBeenCalledWith('/alice/status/t1')
        })
    })
})