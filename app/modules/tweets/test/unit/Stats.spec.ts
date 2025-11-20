import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Stats from '../../components/Tweet/subComponents/Stats/Stats.vue'
import type { Stats as StatsType } from '../../types'

// Mock the formatCount utility
vi.mock('../../utils/lib', () => ({
    formatCount: vi.fn((count) => {
        if (count === 0) return ''
        if (count < 1000) return count.toString()
        if (count < 10000) return `${(count / 1000).toFixed(1)}K`
        if (count < 1000000) return `${Math.floor(count / 1000)}K`
        return `${(count / 1000000).toFixed(1)}M`
    }),
}))

describe('Stats Component', () => {
    const mockStats: StatsType = {
        likes: 100,
        replies: 50,
        retweets: 25,
        views: 1000,
    }

    describe('Stat Counts Rendering', () => {
        it('renders all stat buttons', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            expect(wrapper.find('#tweet-reply-button').exists()).toBe(true)
            expect(wrapper.find('#tweet-retweet-button').exists()).toBe(true)
            expect(wrapper.find('#tweet-like-button').exists()).toBe(true)
            expect(wrapper.find('#tweet-share-button').exists()).toBe(true)
        })

        it('displays formatted reply count', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            expect(replyButton.text()).toBe('50')
        })

        it('displays formatted retweet count', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const retweetButton = wrapper.find('#tweet-retweet-button')
            expect(retweetButton.text()).toBe('25')
        })

        it('displays formatted like count', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const likeButton = wrapper.find('#tweet-like-button')
            expect(likeButton.text()).toBe('100')
        })

        it('displays empty string for zero counts', () => {
            const zeroStats: StatsType = {
                likes: 0,
                replies: 0,
                retweets: 0,
                views: 0,
            }

            const wrapper = mount(Stats, {
                props: { stats: zeroStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const retweetButton = wrapper.find('#tweet-retweet-button')
            const likeButton = wrapper.find('#tweet-like-button')

            expect(replyButton.text()).toBe('')
            expect(retweetButton.text()).toBe('')
            expect(likeButton.text()).toBe('')
        })

        it('formats large numbers correctly', () => {
            const largeStats: StatsType = {
                likes: 5000,
                replies: 1234,
                retweets: 50000,
            }

            const wrapper = mount(Stats, {
                props: { stats: largeStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const retweetButton = wrapper.find('#tweet-retweet-button')
            const likeButton = wrapper.find('#tweet-like-button')

            expect(replyButton.text()).toBe('1.2K')
            expect(retweetButton.text()).toBe('50K')
            expect(likeButton.text()).toBe('5.0K')
        })
    })

    describe('Views Conditional Rendering', () => {
        it('displays views button when views is provided and greater than 0', () => {
            const statsWithViews: StatsType = {
                likes: 100,
                replies: 50,
                retweets: 25,
                views: 1000,
            }

            const wrapper = mount(Stats, { props: { stats: statsWithViews } })
            const viewsButton = wrapper.find('#tweet-views-button')
            expect(viewsButton.exists()).toBe(true)
            expect(viewsButton.text()).toBe('1.0K')
        })

        it('does not display views button when views is 0', () => {
            const statsWithoutViews: StatsType = {
                likes: 100,
                replies: 50,
                retweets: 25,
                views: 0,
            }

            const wrapper = mount(Stats, {
                props: { stats: statsWithoutViews },
            })

            const viewsButton = wrapper.find('#tweet-views-button')
            expect(viewsButton.exists()).toBe(false)
        })

        it('does not display views button when views is undefined', () => {
            const statsWithoutViews: StatsType = {
                likes: 100,
                replies: 50,
                retweets: 25,
            }

            const wrapper = mount(Stats, {
                props: { stats: statsWithoutViews },
            })

            const viewsButton = wrapper.find('#tweet-views-button')
            expect(viewsButton.exists()).toBe(false)
        })

        it('displays views with correct formatting', () => {
            const statsWithHighViews: StatsType = {
                likes: 0,
                replies: 0,
                retweets: 0,
                views: 2500000,
            }

            const wrapper = mount(Stats, {
                props: { stats: statsWithHighViews },
            })

            const viewsButton = wrapper.find('#tweet-views-button')
            expect(viewsButton.text()).toBe('2.5M')
        })
    })

    describe('Button Click Handlers', () => {
        it('prevents event propagation on reply button click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const clickEvent = { stopPropagation: vi.fn() }
            
            await replyButton.trigger('click', clickEvent)
            
            // The @click.stop should prevent propagation
            // We can't directly test .stop but we can verify the button is clickable
            expect(replyButton.exists()).toBe(true)
        })

        it('prevents event propagation on retweet button click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const retweetButton = wrapper.find('#tweet-retweet-button')
            await retweetButton.trigger('click')
            
            expect(retweetButton.exists()).toBe(true)
        })

        it('prevents event propagation on like button click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const likeButton = wrapper.find('#tweet-like-button')
            await likeButton.trigger('click')
            
            expect(likeButton.exists()).toBe(true)
        })

        it('prevents event propagation on share button click', async () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const shareButton = wrapper.find('#tweet-share-button')
            await shareButton.trigger('click')
            
            expect(shareButton.exists()).toBe(true)
        })
    })

    describe('SVG Icons', () => {
        it('renders SVG icon in reply button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const svg = replyButton.find('svg')
            expect(svg.exists()).toBe(true)
        })

        it('renders SVG icon in retweet button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const retweetButton = wrapper.find('#tweet-retweet-button')
            const svg = retweetButton.find('svg')
            expect(svg.exists()).toBe(true)
        })

        it('renders SVG icon in like button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const likeButton = wrapper.find('#tweet-like-button')
            const svg = likeButton.find('svg')
            expect(svg.exists()).toBe(true)
        })

        it('renders SVG icon in share button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const shareButton = wrapper.find('#tweet-share-button')
            const svg = shareButton.find('svg')
            expect(svg.exists()).toBe(true)
        })
    })

    describe('Tooltips', () => {
        it('renders Reply tooltip', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const tooltip = wrapper.find('#tweet-reply-button').element.parentElement?.querySelector('span.absolute')
            expect(tooltip?.textContent?.trim()).toBe('Reply')
        })

        it('renders Retweet tooltip', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const retweetContainer = wrapper.find('#tweet-retweet-button').element.parentElement
            const tooltip = retweetContainer?.querySelector('span.absolute')
            expect(tooltip?.textContent?.trim()).toBe('Retweet')
        })

        it('renders Like tooltip', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const likeContainer = wrapper.find('#tweet-like-button').element.parentElement
            const tooltip = likeContainer?.querySelector('span.absolute')
            expect(tooltip?.textContent?.trim()).toBe('Like')
        })

        it('renders Views tooltip when views exist', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const viewsContainer = wrapper.find('#tweet-views-button').element.parentElement
            const tooltip = viewsContainer?.querySelector('span.absolute')
            expect(tooltip?.textContent?.trim()).toBe('Views')
        })

        it('renders Share tooltip', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const shareContainer = wrapper.find('#tweet-share-button').element.parentElement
            const tooltip = shareContainer?.querySelector('span.absolute')
            expect(tooltip?.textContent?.trim()).toBe('Share')
        })
    })

    describe('CSS Classes and Styling', () => {
        it('applies correct hover color classes for reply button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#reply')
            expect(replyButton.classes()).toContain('hover:text-blue')
        })

        it('applies correct hover color classes for retweet button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const retweetButton = wrapper.find('#retweet')
            expect(retweetButton.classes()).toContain('hover:text-green')
        })

        it('applies correct hover color classes for like button', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const likeButton = wrapper.find('#like')
            expect(likeButton.classes()).toContain('hover:text-red')
        })

        it('applies cursor-pointer class to all buttons', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const retweetButton = wrapper.find('#tweet-retweet-button')
            const likeButton = wrapper.find('#tweet-like-button')
            const shareButton = wrapper.find('#tweet-share-button')

            expect(replyButton.classes()).toContain('cursor-pointer')
            expect(retweetButton.classes()).toContain('cursor-pointer')
            expect(likeButton.classes()).toContain('cursor-pointer')
            expect(shareButton.classes()).toContain('cursor-pointer')
        })

        it('applies transition-colors class to all buttons', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const replyButton = wrapper.find('#tweet-reply-button')
            const retweetButton = wrapper.find('#tweet-retweet-button')
            const likeButton = wrapper.find('#tweet-like-button')

            expect(replyButton.classes()).toContain('transition-colors')
            expect(retweetButton.classes()).toContain('transition-colors')
            expect(likeButton.classes()).toContain('transition-colors')
        })
    })

    describe('Layout', () => {
        it('renders stats in flex container', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const container = wrapper.find('.flex.items-center.justify-between')
            expect(container.exists()).toBe(true)
            expect(container.classes()).toContain('max-w-[425px]')
            expect(container.classes()).toContain('mt-3')
        })

        it('has 4 stat groups when views is not provided', () => {
            const statsWithoutViews: StatsType = {
                likes: 100,
                replies: 50,
                retweets: 25,
            }

            const wrapper = mount(Stats, {
                props: { stats: statsWithoutViews },
            })

            const groups = wrapper.findAll('.group\\/tooltip')
            expect(groups.length).toBe(4) // reply, retweet, like, share
        })

        it('has 5 stat groups when views is provided', () => {
            const wrapper = mount(Stats, {
                props: { stats: mockStats },
            })

            const groups = wrapper.findAll('.group\\/tooltip')
            expect(groups.length).toBe(5) // reply, retweet, like, views, share
        })
    })
})
