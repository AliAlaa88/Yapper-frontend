import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TweetDetails from '../../components/TweetDetails/TweetDetails.vue'
import type { TweetDetails as tweetDetails } from '../../types'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useRoute: vi.fn(() => ({
        params: {
            username: 'alice',
            tweetId: 't1',
        },
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
                    },
                },
            })

            expect(wrapper.find('.animate-spin').exists()).toBe(true)
            expect(wrapper.text()).toContain('Loading')
        })
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
                },
            })

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
                },
            })

            await wrapper.find('button').trigger('click')
            expect(fetchTweetDetailsMock).toHaveBeenCalled()
        })
    })
})
