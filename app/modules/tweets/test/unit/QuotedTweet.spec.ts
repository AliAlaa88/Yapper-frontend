import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
}))

import QuotedTweet from '../../components/Tweet/subComponents/QuotedTweet/QuotedTweet.vue'

describe('QuotedTweet Component', () => {
    it('renders quoted tweet content', () => {
        const tweet = {
            tweet_id: 't1',
            type: 'quote',
            content: 'Quoted tweet',
            images: [],
            videos: [],
            gifs: [],
            likes_count: 1,
            reposts_count: 0,
            views_count: 10,
            quotes_count: 0,
            replies_count: 0,
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
                bio: null,
                followers_count: null,
                following_count: null,
                cover_url: null,
                country: null,
                created_at: '2020-01-01',
                birth_date: null,
                language: null,
            },
            reposted_by: undefined,
            parent_tweet: null,
            conversation_tweet: null,
        }
        const wrapper = mount(QuotedTweet, { props: { tweet } })
        expect(wrapper.text()).toContain('Quoted tweet')
        expect(wrapper.text()).toContain('Alice')
    })
})
