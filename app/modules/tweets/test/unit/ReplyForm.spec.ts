import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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

import ReplyForm from '../../components/TweetDetails/Reply/ReplyForm.vue'

describe('ReplyForm Component', () => {
    it('renders reply input', async () => {
        const wrapper = mount(ReplyForm, {
            props: {
                parentTweetId: '123',
                replyingToUsername: 'user1',
            },
            global: {
                mocks: {
                    $t: (msg) => msg,
                    t: (msg) => msg,
                },
                stubs: {
                    PostTweet: {
                        template: '<div><textarea /></div>',
                    },
                    Button: {
                        template: '<button></button>',
                    },
                },
            },
        })
        // Simulate focus to show expanded state
        await wrapper.vm.handleFocus()
        await wrapper.vm.$nextTick()
        expect(wrapper.find('textarea').exists()).toBe(true)
    })
})
